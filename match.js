import { Team } from "./team.js"
import * as repository from "./match-repository.js"

/**
 * Holds match data. Uniquely identified by `match`, `set`, and `type`. Roughly keeps track of the
 * same data as the match page on The Blue Alliance.
 */
export class Match {

    #number;
    #set;
    #type;
    #id;

    #red;
    #blue;

    /** @type {Match.Result} */
    result;

    /**
     * @param {number} number the number of the match
     *                       (e.g. 9 for Qualification 9, 2 for Quarterfinal 3 Match 2)
     * @param {Match.Type} type the type for this match
     * @param {number} set if this is a playoff match, the set for the match
     *                     (e.g. 3 for Quarterfinal 3 Match 2), 0 for qualifications
     */
    constructor(number, type = Match.Type.QUALIFICATION, set = 0) {
        this.#number = number;
        this.#set = type == Match.Type.QUALIFICATION ? 0 : set;
        this.#type = type;
        this.#id = [number, set, type]; // This triple uniquely identifies a match
        this.#red = new Match.#Alliance(repository.getRedTeams(...this.#id), Match.AllianceColor.RED, this);
        this.#blue = new Match.#Alliance(repository.getBlueTeams(...this.#id), Match.AllianceColor.BLUE, this);

        this.result = repository.getResult(...this.#id);
    }

    /**
     * Enum-like getter for possible match results.
     */
    static get Result() {
        return {
            UNDETERMINED: "Undetermined",
            RED_WIN: "Red win",
            TIE: "Tie",
            BLUE_WIN: "Blue win"
        }
    }

    /**
     * Enum-like getter for alliance colors.
     */
    static get AllianceColor() {
        return {
            RED: "Red",
            BLUE: "Blue"
        }
    }

    /**
     * Enum-like getter for match types.
     */
    static get Type() {
        return {
            QUALIFICATION: "Qualification",
            QUARTERFINAL: "Quarterfinal",
            SEMIFINAL: "Semifinal",
            FINAL: "Final"
        }
    }

    /**
     * Enum-like getter for control panel colors.
     */
    static get ControlPanel() {
        return {
            NO_COLOR: 0,
            BLUE: 1,
            GREEN: 2,
            RED: 3
        }
    }

    /**
     * Enum-like getter for Infinite Recharge phases.
     */
    static get Phase() {
        return {
            NONE: 1,
            PHASE_1: 2,
            PHASE_2: 3,
            PHASE_3: 4
        }
    }

    static get PointValues() {
        return {
            INITIATION_LINE: 5,
            AUTO_BOTTOM: 2,
            AUTO_UPPER: 4,
            TELEOP_BOTTOM: 1,
            TELEOP_UPPER: 2,
            ROTATION_CONTROL: 20,
            POSITION_CONTROL: 25,
            HANG: 25,
            PARK: 5,
            LEVEL: 15,
            FOUL: 3,
            TECH_FOUL: 15
        }
    }

    /**
     * Gets the number of this match (e.g. 9 for Qualification 9, 2 for Quarterfinal 3
     * Match 2)
     * @type {number}
     */
    get number() {
        return this.#number;
    }

    /**
     * Gets the set this match is apart of. Always 0 for qualification matches.
     * @type {number}
     */
    get set() {
        return this.#set;
    }

    /**
     * Gets the type of this match.
     * @type {Match.Type}
     */
    get type() {
        return this.#type;
    }

    get red() {
        return this.#red;
    }

    get blue() {
        return this.#blue;
    }

    /**
     * Gets this match's friendly name.
     */
    get friendlyName() {
        if (this.type == Match.Type.QUALIFICATION || this.type == Match.Type.FINAL) {
            return this.type + " " + this.number;
        } else {
            return this.type + " " + this.set + " Match " + this.number;
        }
    }

    /**
     * Gets all teams in this match in an array, with red teams first.
     * @type {Team[]}
     */
    get teams() {
        return this.#red.teams.concat(this.#blue.teams);
    }

    get teamNumbers() {
        return this.teams.map(team => team.number);
    }

    /**
     * Checks if the provided team is disqualified from this match.
     * 
     * @param {Team | number} team
     * @return {boolean} `true` if the provided team is disqualified, `false` otherwise.
     */
    isDisqualified(team) {
        if (team instanceof Team) {
            team = team.number;
        }
        if (this.teams.map(team => team.number).includes(team)) {
            return repository.isDisqualified(team, ...this.#id);
        }
        return false;
    }

    /**
     * Checks if the provided team is a surrogate in this match.
     * @param {Team | number} team
     * @return {boolean} `true` if the provided team is a surrogate, `false` otherwise.
     */
    isSurrogate(team) {
        if (team instanceof Team) {
            team = team.number;
        }
        if (this.teams.map(team => team.number).includes(team)) {
            return repository.isSurrogate(team, ...this.#id);
        }
        return false;
    }

    determineResult() {
        if (this.red.matchPoints > this.blue.matchPoints) this.result = Match.Result.RED_WIN;
        else if (this.red.matchPoints < this.blue.matchPoints) this.result = Match.Result.BLUE_WIN;
        else this.result = Match.Result.TIE;
    }

    /**
     * Saves the state of this match to the repository.
     */
    save() {
        repository.setResult(this.result, ...this.#id);
        this.red.save();
        this.blue.save();
    }

    /**
     * Clears match data locally. Old match data stays in database until this match gets saved.
     */
    clear() {
        this.result = Match.Result.UNDETERMINED;
        this.red.clear();
        this.blue.clear();
    }

    /**
     * Gets the next match in the competition with an undetermined outcome.
     * @return {Match} the next match
     */
    static getNextMatch() {
        // TODO: Bo3 played all at once or one match at a time?
        let matches = this.getSortedMatches();
        let match = matches.find(match => match.result == Match.Result.UNDETERMINED);
        return match ? match : matches[matches.length - 1] // If matches have been played, just return the last one
    }

    /**
     * @return {Match[]}
     */
    static getSortedMatches() {
        let matches = repository.getAllMatches();
        matches.sort((m1, m2) => {
            if (m1.type == m2.type == Match.Type.QUALIFICATION) return m1.match - m2.match;
            else if (m1.type == m2.type) {
                // Order playoffs by match first, so Bo3s are spread out
                if (m1.match != m2.match) return m1.match - m2.match;
                else return m1.set - m2.set;
            }
            else if (m1.type == Match.Type.QUALIFICATION) return -1;
            else if (m2.type == Match.Type.QUALIFICATION) return 1;
            else if (m1.type == Match.Type.QUARTERFINAL) return -1;
            else if (m2.type == Match.Type.QUARTERFINAL) return 1;
            else if (m1.type == Match.Type.SEMIFINAL) return -1;
            else if (m2.type == Match.Type.SEMIFINAL) return 1;
            return 0; // Both matches are finals with the same set and match, shouldn't ever happen
        });
        return matches;
    }

    /**
     * Puts a new playoff match in the schedule.
     * @param {string} name 
     * @param {Team[]} redTeams 
     * @param {string} redAllianceName 
     * @param {Team[]} blueTeams 
     * @param {string} blueAllianceName 
     */
    static generatePlayoffMatch(name, redTeams, redAllianceName, blueTeams, blueAllianceName) {
        // TODO: Should we persist playoff alliances separately?
        // Plan without persisting playoff alliances:
        //  Add alliance name fields to Alliance, only included in playoffs
        //  Manually enter the 8 guaranteed quarterfinal matches into the db after alliance selections
        //  From there, generate tiebreaker matches as needed and semifinal and final matches as they're determined
        // If we persisted playoff alliances we could generate the initial quarterfinal matches automatically too
    }

    /**
     * Class to hold point data per alliance for Match.
     * 
     * Emulates something like a private inner class by passing in `match` for access to
     * the enclosing Match instance.
     */
    static #Alliance = class Alliance {

        #teams;
        #color;
        #match;

        /** @type {Match.Phase} */          phase;
        /** @type {number} */               powerCellsInPhase;
        /** @type {Match.ControlPanel} */   positionControlTarget;
        /** @type {number} */               initiationLine;
        /** @type {number} */               autoBottomPort;
        /** @type {number} */               autoUpperPort;
        /** @type {number} */               teleopBottomPort;
        /** @type {number} */               teleopUpperPort;
        /** @type {number} */               parks;
        /** @type {number} */               hangs;
        /** @type {boolean} */              level;
        /** @type {number} */               fouls;
        /** @type {number} */               techFouls;

        addInitiationLine() { if (this.initiationLine < 3) this.initiationLine++; }
        removeInitiationLine() { if (this.initiationLine > 0) this.initiationLine--; }
        addPark() { if (this.hangs + this.parks < 3) this.parks++; }
        removePark() { if (this.parks > 0) this.parks--; }
        addHang() { if (this.hangs + this.parks < 3) this.hangs++; }
        removeHang() { if (this.hangs > 0) this.hangs--; }
        addFoul() { this.fouls++; }
        removeFoul() { if (this.fouls > 0) this.fouls--; }
        addTechFoul() { this.techFouls++; }
        removeTechFoul() { if (this.techFouls > 0) this.techFouls--; }

        /**
         * @type {Team[]}
         */
        get teams() {
            return this.#teams;
        }

        get teamNumbers() {
            return this.#teams.map(team => team.number);
        }

        /**
         * @type {Match.AllianceColor}
         */
        get color() {
            return this.#color;
        }

        get matchPoints() {
            return this.initiationLinePoints
                 + this.powerCellPoints
                 + this.controlPanelPoints
                 + this.endgamePoints
                 + this.penaltyPoints;
        }

        get autoPoints() {
            return this.initiationLinePoints
                 + this.autoBottomPort * Match.PointValues.AUTO_BOTTOM
                 + this.autoUpperPort * Match.PointValues.AUTO_UPPER;
        }

        get initiationLinePoints() {
            return this.initiationLine * Match.PointValues.INITIATION_LINE;
        }

        get powerCellPoints() {
            return this.autoBottomPort * Match.PointValues.AUTO_BOTTOM
                 + this.autoUpperPort * Match.PointValues.AUTO_UPPER
                 + this.teleopBottomPort * Match.PointValues.TELEOP_BOTTOM
                 + this.teleopUpperPort * Match.PointValues.TELEOP_UPPER;
        }

        get teleopPowerCellPoints() {
            return this.teleopBottomPort * Match.PointValues.TELEOP_BOTTOM
                 + this.teleopUpperPort * Match.PointValues.TELEOP_UPPER;
        }

        get controlPanelPoints() {
            if (this.phase == Match.Phase.PHASE_2) return Match.PointValues.ROTATION_CONTROL;
            if (this.phase == Match.Phase.PHASE_3) return Match.PointValues.ROTATION_CONTROL + Match.PointValues.POSITION_CONTROL;
            return 0;
        }

        get endgamePoints() {
            return this.parks * Match.PointValues.PARK
                 + this.hangs * Match.PointValues.HANG
                 + (this.level && this.hangs > 0 ? Match.PointValues.LEVEL : 0);
        }

        /**
         * The number of foul points awarded to this alliance as a result of fouls
         * committed by the opponent alliance.
         */
        get penaltyPoints() {
            return this.fouls * Match.PointValues.FOUL
                 + this.techFouls * Match.PointValues.TECH_FOUL;
        }

        get shieldGeneratorEnergized() {
            return this.phase == Match.Phase.PHASE_3;
        }

        get shieldGeneratorOperational() {
            if (this.endgamePoints >= 65) console.log(this.#match);
            return this.endgamePoints >= 65;
        }

        /**
         * @param {number[]} teams 
         * @param {Match.AllianceColor} color 
         * @param {Match} match instance of Match enclosing this Alliance
         */
        constructor(teams, color, match) {
            this.#teams = teams.map(number => new Team(number));
            this.#color = color;
            this.#match = match;

            this.phase                      = repository.getPhase(...this.#match.#id, this.color);
            this.powerCellsInPhase          = repository.getPowerCellsInPhase(...this.#match.#id, this.color);
            this.positionControlTarget      = repository.getPositionControlTarget(...this.#match.#id, this.color);
            this.initiationLine             = repository.getInitiationLine(...this.#match.#id, this.color);
            this.autoBottomPort             = repository.getAutoBottomPort(...this.#match.#id, this.color);
            this.autoUpperPort              = repository.getAutoUpperPort(...this.#match.#id, this.color);
            this.teleopBottomPort           = repository.getTeleopBottomPort(...this.#match.#id, this.color);
            this.teleopUpperPort            = repository.getTeleopUpperPort(...this.#match.#id, this.color);
            this.parks                      = repository.getParks(...this.#match.#id, this.color);
            this.hangs                      = repository.getHangs(...this.#match.#id, this.color);
            this.level                      = repository.getLevel(...this.#match.#id, this.color);
            this.fouls                      = repository.getRegularFouls(...this.#match.#id, this.color);
            this.techFouls                  = repository.getTechFouls(...this.#match.#id, this.color);
        }

        save() {
            repository.setMatchPoints(this.matchPoints, ...this.#match.#id, this.color);
            repository.setPhase(this.phase, ...this.#match.#id, this.color);
            repository.setPowerCellsInPhase(this.powerCellsInPhase, ...this.#match.#id, this.color);
            repository.setPositionControlTarget(this.positionControlTarget, ...this.#match.#id, this.color);
            repository.setInitiationLine(this.initiationLine, ...this.#match.#id, this.color);
            repository.setAutoBottomPort(this.autoBottomPort, ...this.#match.#id, this.color);
            repository.setAutoUpperPort(this.autoUpperPort, ...this.#match.#id, this.color);
            repository.setTeleopBottomPort(this.teleopBottomPort, ...this.#match.#id, this.color);
            repository.setTeleopUpperPort(this.teleopUpperPort, ...this.#match.#id, this.color);
            repository.setParks(this.parks, ...this.#match.#id, this.color);
            repository.setHangs(this.hangs, ...this.#match.#id, this.color);
            repository.setLevel(this.level, ...this.#match.#id, this.color);
            repository.setRegularFouls(this.fouls, ...this.#match.#id, this.color);
            repository.setTechFouls(this.techFouls, ...this.#match.#id, this.color);
            repository.setShieldGeneratorEnergized(this.shieldGeneratorEnergized, ...this.#match.#id, this.color);
            repository.setShieldGeneratorOperational(this.shieldGeneratorOperational, ...this.#match.#id, this.color);
        }
        
        clear() {
            this.phase = Match.Phase.NONE;
            this.powerCellsInPhase = 0;
            this.positionControlTarget = Match.ControlPanel.NO_COLOR;
            this.initiationLine = 0;
            this.autoBottomPort = 0;
            this.autoUpperPort = 0;
            this.teleopBottomPort = 0;
            this.teleopUpperPort = 0;
            this.parks = 0;
            this.hangs = 0;
            this.level = false;
            this.fouls = 0;
            this.techFouls = 0;
        }
    }

}