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

    static get PointValues() {
        return {
            HAB_DISMOUNT_1: 3,
            HAB_DISMOUNT_2: 6,
            HAB_DISMOUNT_3: 9,
            HATCH: 3,
            CARGO: 3,
            ROCKET: 10,
            HAB_CLIMB_1: 3,
            HAB_CLIMB_2: 6,
            HAB_CLIMB_3: 12,
            FOUL: 3,
            TECH_FOUL: 5
        }
    }
    
    static get DismountLevel() {
        return {
            0: 0,
            1: Match.PointValues.HAB_DISMOUNT_1,
            2: Match.PointValues.HAB_DISMOUNT_2,
            3: Match.PointValues.HAB_DISMOUNT_3,
        }
    }

    static get ClimbLevel() {
        return {
            0: 0,
            1: Match.PointValues.HAB_CLIMB_1,
            2: Match.PointValues.HAB_CLIMB_2,
            3: Match.PointValues.HAB_CLIMB_3,
        }
    }
    
    static get HatchType() {
        return {
            NULL_HATCH: -1,
            NO_HATCH: 0,
            HATCH: 1
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
                if (m1.number != m2.number) return m1.number - m2.number;
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

        /** @type {number[]} */    habDismounts = [0, 0, 0];
        /** @type {HatchType[]} */ hatches = Array(20).fill(0);
        /** @type {boolean[]} */   cargo = Array(20).fill(0);
        /** @type {number[]} */    habClimbs = [0, 0, 0];
        /** @type {number} */      fouls;
        /** @type {number} */      techFouls;

        setHabDismount(pos, lvl) { this.habDismounts[pos] = Match.DismountLevel[lvl]; }
        setHabClimb(pos, lvl) { this.habClimbs[pos] = Match.ClimbLevel[lvl]; }
        setHatch(pos, type) {
            if (pos < 12 && type === Match.HatchType.NULL_HATCH) return;
            this.hatches[pos] = type;
        }
        setCargo(pos, bool) {this.cargo[pos] = bool; }
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
            return this.autoPoints
                 + this.cargoPoints
                 + this.hatchPoints
                 + this.endgamePoints
                 + this.penaltyPoints
                 + (this.rocketComplete ? Match.PointValues.ROCKET : 0);
        }

        get autoPoints() {
            return this.habDismounts.reduce((sum, pts) => sum + pts, 0);
        }

        get cargoPoints() {
            return this.cargo.filter(Boolean).length * Match.PointValues.CARGO;
        }

        get hatchPoints() {
            return this.hatches.filter(e => e === Match.HatchType.HATCH).length * Match.PointValues.HATCH;
        }

        get endgamePoints() {
            return this.habClimbs.reduce((sum, pts) => sum + pts, 0);
        }

        /**
         * The number of foul points awarded to this alliance as a result of fouls
         * committed by the opponent alliance.
         */
        get penaltyPoints() {
            return this.fouls * Match.PointValues.FOUL
                 + this.techFouls * Match.PointValues.TECH_FOUL;
        }

        get rocketComplete() {
            let rockets = [[0, 1, 2, 3, 4, 5], [6, 7, 8, 9, 10, 11]];
            for (const rocket of rockets) {
                let completedSpots = rocket.map(pos => this.hatches[pos] == Match.HatchType.HATCH && this.cargo[pos]);
                if (completedSpots.every(Boolean)) return true;
            }
            return false;
        }

        get docked() {
            return this.endgamePoints >= 15;
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

            this.habDismounts = repository.getHabCrossings(...this.#match.#id, this.color);
            this.hatches      = repository.getHatches(...this.#match.#id, this.color);
            this.cargo        = repository.getCargo(...this.#match.#id, this.color);
            this.habClimbs    = repository.getHabClimbs(...this.#match.#id, this.color);
            this.fouls        = repository.getRegularFouls(...this.#match.#id, this.color);
            this.techFouls    = repository.getTechFouls(...this.#match.#id, this.color);
        }

        save() {
            repository.setMatchPoints(this.matchPoints, ...this.#match.#id, this.color);
            repository.setHabCrossings(this.habClimbs, ...this.#match.#id, this.color);
            repository.setHatches(this.hatches, ...this.#match.#id, this.color);
            repository.setCargo(this.cargo, ...this.#match.#id, this.color);
            repository.setHabClimbs(this.habClimbs, ...this.#match.#id, this.color);
            repository.setRegularFouls(this.fouls, ...this.#match.#id, this.color);
            repository.setTechFouls(this.techFouls, ...this.#match.#id, this.color);
            repository.setRocketComplete(this.rocketComplete, ...this.#match.#id, this.color);
            repository.setDocked(this.docked, ...this.#match.#id, this.color);
        }
        
        clear() {
            this.habDismounts = [0, 0, 0];
            this.hatches = Array(20).fill(0);
            this.cargo = Array(20).fill(0);
            this.habClimbs = [0, 0, 0];
            this.fouls = 0;
            this.techFouls = 0;
        }
    }
}