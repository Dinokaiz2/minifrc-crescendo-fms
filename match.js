import { Team } from "./team.js"
import * as repository from "./match-repository.js"

/**
 * Holds match data. Uniquely identified by `match`, `set`, and `type`. Roughly keeps track of the
 * same data as the match page on The Blue Alliance.
 */
export class Match {

    #match;
    #set;
    #type;
    #red;
    #blue;

    /**
     * @param {number} match the number of the match
     *                       (e.g. 9 for Qualification 9, 2 for Quarterfinal 3 Match 2)
     * @param {Match.Type} type the type for this match
     * @param {number} set if this is a playoff match, the set for the match
     *                     (e.g. 3 for Quarterfinal 3 Match 2), 0 for qualifications
     */
    constructor(match, type = Match.Type.QUALIFICATION, set = 0) {
        this.#match = match;
        this.#type = type;
        this.#set = type == Match.Type.QUALIFICATION ? 0 : set;
        this.#red = new this.#Alliance(redTeams, Match.AllianceColor.RED, this);
        this.#blue = new this.#Alliance(blueTeams, Match.AllianceColor.BLUE, this);
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

    /**
     * Gets the number of this match (e.g. 9 for Qualification 9, 2 for Quarterfinal 3
     * Match 2)
     * @type {number}
     */
    get match() {
        return this.#match;
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
            return this.type + " " + this.match;
        } else {
            return this.type + " " + this.set + " Match " + this.match;
        }
    }

    /**
     * Gets all teams in this match in an array, with red teams first.
     * @type {Team[]}
     */
    get teams() {
        return this.#red.teams.concat(this.#blue.teams);
    }

    /**
     * @type {Match.Result}
     */
    get result() {
        return repository.getResult(this.name);
    }

    set result(value) {
        repository.setResult(value, this.name);
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
            return repository.isDisqualified(this.name, team);
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
            return repository.isSurrogate(this.name, team);
        }
        return false;
    }

    /**
     * Gets the next match in the competition with an undetermined outcome.
     * @return {Match} the next match
     */
    static getNextMatch() {
        // TODO: Bo3 played all at once or one match at a time?
        matches = repository.getAllMatches();
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
        for (match in matches) {
            if (match.result == Match.Result.UNDETERMINED) return match;
        }
        return matches[matches.length - 1] // Looks like all matches have been played, just return the last one
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
    #Alliance = class Alliance {

        #teams;
        #color;
        #match;

        /**
         * @param {number[]} teams 
         * @param {Match.Color} color 
         * @param {Match} match instance of Match enclossing this Alliance
         */
        constructor(teams, color, match) {
            this.#teams = teams.map(number => new Team(number));
            this.#color = color;
            this.#match = match;
        }

        /**
         * @type {Team[]}
         */
        get teams() {
            return this.#teams;
        }

        /**
         * @type {Match.Color}
         */
        get color() {
            return this.#color;
        }

        get matchPoints() {
            return repository.getMatchPoints(this.#match.number, type, set, this.color);
        }

        set matchPoints(value) {
            repository.setMatchPoints(value, this.#match.name, this.color);
        }

        get rankingPoints() {
            return repository.getRankingPoints(this.#match.name, this.color);
        }

        set rankingPoints(value) {
            repository.setRankingPoints(value, this.#match.name, this.color);
        }

        get initiationLinePoints() {
            return repository.getInitiationLine(this.#match.name, this.color);
        }

        set initiationLinePoints(value) {
            repository.setInitiationLine(value, this.#match.name, this.color);
        }

        get autoBottomPortPoints() {
            return repository.getAutoBottomPort(this.#match.name, this.color);
        }

        set autoBottomPortPoints(value) {
            repository.setAutoBottomPort(value, this.#match.name, this.color);
        }

        get autoUpperPortPoints() {
            return repository.getAutoUpperPort(this.#match.name, this.color);
        }

        set autoUpperPortPoints(value) {
            repository.setAutoUpperPort(value, this.#match.name, this.color);
        }

        get teleopBottomPortPoints() {
            return repository.getTeleopBottomPort(this.#match.name, this.color);
        }

        set teleopBottomPortPoints(value) {
            repository.setTeleopBottomPort(value, this.#match.name, this.color);
        }

        get teleopUpperPortPoints() {
            return repository.getTeleopUpperPort(this.#match.name, this.color);
        }

        set teleopUpperPortPoints(value) {
            repository.setTeleopUpperPort(value, this.#match.name, this.color);
        }

        get controlPanelPoints() {
            return repository.getControlPanel(this.#match.name, this.color);
        }

        set controlPanelPoints(value) {
            repository.setControlPanel(value, this.#match.name, this.color);
        }

        get endgamePoints() {
            return repository.getEndgame(this.#match.name, this.color);
        }

        set endgamePoints(value) {
            repository.setEndgame(value, this.#match.name, this.color);
        }

        /**
         * The number of foul points awarded to this alliance as a result of fouls
         * committed by the opponent alliance.
         */
        get foulPoints() {
            return repository.getFouls(this.#match.name, this.color);
        }

        set foulPoints(value) {
            repository.setFouls(value, this.#match.name, this.color);
        }

        get shieldGeneratorOperational() {
            return repository.getShieldGeneratorOperational(this.#match.name, this.color);
        }

        set shieldGeneratorOperational(value) {
            repository.setShieldGeneratorOperational(value, this.#match.name, this.color);
        }

        get shieldGeneratorEnergized() {
            return repository.getShieldGeneratorEnergized(this.#match.name, this.color);
        }

        set shieldGeneratorEnergized(value) {
            repository.setShieldGeneratorEnergized(value, this.#match.name, this.color);
        }
    }

}