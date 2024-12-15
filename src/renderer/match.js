import { Team } from "./team.js"
import * as repository from "./match-repository.js" // TODO: Causes control window to import match-repository, which fails on running generate()
import * as sound from "./sound.js";

import { Competition } from "./controller.js" // Needed for match time-based scoring. TODO: Maybe match time should be tracked in Match instead of Competition.

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
        this.#red = new Match.#Alliance(Match.AllianceColor.RED, this);
        this.#blue = new Match.#Alliance(Match.AllianceColor.BLUE, this);

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
            PLAYOFF: "Playoff",
            FINAL: "Final"
        }
    }

    static get PointValues() {
        return {
            LEAVE: 2,
            AUTO_AMP: 2,
            AUTO_SPEAKER: 5,
            AMP: 1,
            SPEAKER: 2,
            AMPED_SPEAKER: 5,
            PARK: 1,
            ONSTAGE: 3,
            TRAP: 5,
            HARMONY: 2,
            FOUL: 2,
            TECH_FOUL: 5
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

    /** @type {Match.Alliance} */
    get red() {
        return this.#red;
    }

    /** @type {Match.Alliance} */
    get blue() {
        return this.#blue;
    }

    /**
     * Gets this match's friendly name.
     */
    get friendlyName() {
        return this.type + " " + this.number;
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

    isPlayoff() {
        return this.#type == Match.Type.PLAYOFF || this.#type == Match.Type.FINAL;
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

        const PLAYOFF_STRUCTURE = {
            // 1vBye (1)
            // 1: 4v5 (2)
            // 2: 2v7 (3)
            // 3: 3v6 (4)
            // L2vBye (5)
            // 4: L2vL3 (6)
            // 5: 1vW1 (7)
            // 6: W2vW3 (8)
            // 7: L5vW4 (9)
            // 8: L6vL1 (10)
            // 9: W5vW6 (11)
            // 10: W8vW7 (12)
            // 11: L9vW10 (13)
            // 12: W9vW11 finals

            // 1: 4v5 (2)
            // 2: 2v7 (3)
            // 3: 3v6 (4)
            4: ["L", 2, "L", 3, Match.Type.PLAYOFF, 4],
            // 5: 1vW1
            6: ["W", 2, "W", 3, Match.Type.PLAYOFF, 6],
            7: ["L", 5, "W", 4, Match.Type.PLAYOFF, 7],
            8: ["L", 6, "L", 1, Match.Type.PLAYOFF, 8],
            9: ["W", 5, "W", 6, Match.Type.PLAYOFF, 9],
            10: ["W", 8, "W", 7, Match.Type.PLAYOFF, 10],
            11: ["L", 9, "W", 10, Match.Type.PLAYOFF, 11],
            12: ["W", 9, "W", 11, Match.Type.FINAL, 1],
        };

        let matches = this.getSortedMatches();
        let match = matches.find(match => match.result == Match.Result.UNDETERMINED);
        if (!match && matches[matches.length - 1].type == Match.Type.PLAYOFF) {

            function getAlliance(number, result) {
                let match = matches.find(match => match.isPlayoff() && match.number == number);
                if (result == "W" && match.result == Match.Result.RED_WIN
                    || result == "L" && match.result == Match.Result.BLUE_WIN) return match.red;
                else if (result == "W" && match.result == Match.Result.BLUE_WIN
                    || result == "L" && match.result == Match.Result.RED_WIN) return match.blue;
                else return false;
            }

            let matchData = PLAYOFF_STRUCTURE[matches[matches.length - 1].number + 1];
            if (!matchData) return matches[matches.length - 1];
            let redAlliance = getAlliance(matchData[1], matchData[0]);
            let blueAlliance = getAlliance(matchData[3], matchData[2]);
            if (!redAlliance || !blueAlliance) return matches[matches.length - 1]; // Give up for ties

            repository.generateMatch(matchData[5], 0, matchData[4], redAlliance.teamNumbers, blueAlliance.teamNumbers, redAlliance.number, blueAlliance.number);
            if (matchData[4] == Match.Type.FINAL) {
                repository.generateMatch(2, 0, matchData[4], redAlliance.teamNumbers, blueAlliance.teamNumbers, redAlliance.number, blueAlliance.number);
                repository.generateMatch(3, 0, matchData[4], redAlliance.teamNumbers, blueAlliance.teamNumbers, redAlliance.number, blueAlliance.number);
            }
            matches = this.getSortedMatches();
            match = matches.find(match => match.result == Match.Result.UNDETERMINED);
        }
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
            else if (m1.type == Match.Type.PLAYOFF) return -1;
            else if (m2.type == Match.Type.PLAYOFF) return 1;
            return 0; // Both matches are finals with the same set and match, shouldn't ever happen
        });
        return matches;
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
        #number; // 0 in qualifications

        /** @type {number} */    leaves = 0;
        /** @type {number} */    autoAmpNotes = 0;
        /** @type {number} */    autoSpeakerNotes = 0;
        /** @type {number} */    ampNotes = 0; // Teleop only
        /** @type {number} */    ampCharge = 0; // Capped at 2, but keep track past that to allow amp undo
        /** @type {number} */    speakerNotes = 0; // Teleop only
        /** @type {number} */    ampedSpeakerNotes = 0; // Teleop only
        /** @type {number} */    notesToAmpExpiry = 4; // 4 amped speaker notes end amplification
        /** @type {boolean} */   coopertition = false;
        /** @type {number[]} */  stage = [0, 0, 0]; // Point values of completed endgame tasks
        /** @type {boolean[]} */ trapNotes = [false, false, false];
        /** @type {number} */    harmony = 0; // Number of instances of harmony, up to 2
        /** @type {number} */    fouls = 0; // Awarded to this alliance, committed by opponent
        /** @type {number} */    techFouls = 0; // Awarded to this alliance, committed by opponent

        amplificationTimeoutId = 0;
        amplificationTimestamp = -1;


        setLeaves(count) { this.leaves = count; }

        addAmpCharge()        { if (!this.isAmplified) this.ampCharge++; };
        removeAmpCharge()     { if (this.ampCharge > 0) this.ampCharge--; };
        useAmpCharge()        { if (this.ampCharge > 0) this.ampCharge = Math.min(this.ampCharge, 2) - 1; };
        addAutoAmpNote()      { this.autoAmpNotes++; this.addAmpCharge(); };
        removeAutoAmpNote()   { if (this.autoAmpNotes > 0) { this.autoAmpNotes--; this.removeAmpCharge(); } };
        addTeleopAmpNote()    { this.ampNotes++; this.addAmpCharge(); };
        removeTeleopAmpNote() { if (this.ampNotes > 0) { this.ampNotes--; this.removeAmpCharge(); } };
        addAmpNote()          { if (Competition.inAuto) this.addAutoAmpNote(); else this.addTeleopAmpNote(); };
        removeAmpNote()       { if (Competition.inAuto) this.removeAutoAmpNote(); else this.removeTeleopAmpNote(); };

        addAutoSpeakerNote()      { this.autoSpeakerNotes++; };
        removeAutoSpeakerNote()   { if (this.autoSpeakerNotes > 0) this.autoSpeakerNotes--; };
        addTeleopSpeakerNote()    { this.speakerNotes++; };
        removeTeleopSpeakerNote() { if (this.speakerNotes > 0) this.speakerNotes--; };
        addAmpedSpeakerNote()     { this.ampedSpeakerNotes++; if (--this.notesToAmpExpiry == 0) this.endAmplification(); };
        removeAmpedSpeakerNote()  { if (this.ampedSpeakerNotes > 0) { this.ampedSpeakerNotes--; this.notesToAmpExpiry++; } };
        addSpeakerNote() {
            if (Competition.inAuto) this.addAutoSpeakerNote();
            else if (this.isAmplified) this.addAmpedSpeakerNote(); 
            else this.addTeleopSpeakerNote();
        };
        removeSpeakerNote()        {
            if (Competition.inAuto) this.removeAutoSpeakerNote();
            else if (this.isAmplified) this.removeAmpedSpeakerNote(); 
            else this.removeTeleopSpeakerNote();
        }

        endAmplification() {
            this.ampCharge = 0;
            this.notesToAmpExpiry = 4;
            clearTimeout(this.amplificationTimeoutId);
            this.amplificationTimestamp = -1;
            sound.endAmplification();
        }
        startAmplification() {
            if (this.ampCharge < 2) return;
            this.ampCharge = 0;
            this.notesToAmpExpiry = 4;
            this.amplificationTimeoutId = setTimeout(this.endAmplification.bind(this), 10000);
            this.amplificationTimestamp = Date.now();
            sound.startAmplification();
        }
        get isAmplified() {
            return this.amplificationTimestamp >= 0;
        }
        /** Percentage of duration remaining, from 0 to 1.  */
        get ampDurationRemaining () {
            return 1 - Math.max(0, Math.min(1, (Date.now() - this.amplificationTimestamp) / 10000));
        }

        setStage(pos, pts) { this.stage[pos] = pts; }
        setTrapNote(pos, bool) { this.trapNotes[pos] = bool; }
        setHarmony(count) { this.harmony = count; }

        setCoopertition() {
            if (Competition.inMatch && Competition.matchMillisElapsed < 45000 && this.ampCharge >= 1 && !this.coopertition) {
                this.coopertition = true;
                this.useAmpCharge();
            }
        }
        setCoopertitionForce(bool) { this.coopertition = bool; }
        
        addFoul()                 { this.fouls++; }
        removeFoul()              { if (this.fouls > 0) this.fouls--; }
        addTechFoul()             { this.techFouls++; }
        removeTechFoul()          { if (this.techFouls > 0) this.techFouls--; }
        
        get teams() { return this.#teams; }
        get teamNumbers() { return this.#teams.map(team => team.number); }
        get color() { return this.#color; }
        get number() { return this.#number; }

        get matchPoints() {
            return this.leavePoints
                + this.ampPoints
                + this.speakerPoints
                + this.stagePoints
                + this.penaltyPoints;
        }

        get leavePoints() {
            return this.leaves * Match.PointValues.LEAVE;
        }
        get autoNotePoints() {
            return this.autoAmpNotes * Match.PointValues.AUTO_AMP
                + this.autoSpeakerNotes * Match.PointValues.AUTO_SPEAKER;
        }
        get autoPoints() {
            return this.leavePoints + this.autoNotePoints;
        }

        get ampPoints() {
            return this.autoAmpNotes * Match.PointValues.AUTO_AMP
                + this.ampNotes * Match.PointValues.AMP;
        }
        get speakerPoints() {
            return this.autoSpeakerNotes * Match.PointValues.AUTO_SPEAKER
                + this.speakerNotes * Match.PointValues.SPEAKER
                + this.ampedSpeakerNotes * Match.PointValues.AMPED_SPEAKER;
        }

        get stagePoints() {
            return this.stage.reduce((sum, pts) => sum + pts, 0)
                + this.trapNotes.reduce((sum, pts) => sum + pts, 0) * Match.PointValues.TRAP
                + this.harmony * Match.PointValues.HARMONY;
        }

        get penaltyPoints() {
            return this.fouls * Match.PointValues.FOUL
                + this.techFouls * Match.PointValues.TECH_FOUL;
        }

        get notes() {
            return this.autoAmpNotes + this.autoSpeakerNotes
                + this.ampNotes + this.speakerNotes + this.ampedSpeakerNotes;
        }
        get coopBonus() {
            return this.#match.#red.coopertition && this.#match.#blue.coopertition;
        }
        get melodyThreshold() {
            return this.coopBonus ? 12 : 15;
        }
        get melody() {
            return this.notes >= this.melodyThreshold;
        }
        get ensemble() {
            return this.stagePoints >= 9;
        }

        /**
         * @param {number[]} teams 
         * @param {Match.AllianceColor} color 
         * @param {Match} match instance of Match enclosing this Alliance
         */
        constructor(color, match) {
            this.#color = color;
            this.#match = match;

            let teamNumbers = repository.getAllianceTeams(...this.#match.#id, this.color);
            this.#teams = teamNumbers.map(number => new Team(number));
            if (match.isPlayoff()) this.#number = repository.getAllianceNumber(...this.#match.#id, this.color);

            this.leaves            = repository.getLeaves(...this.#match.#id, this.color);
            this.autoAmpNotes      = repository.getAutoAmpNotes(...this.#match.#id, this.color);
            this.autoSpeakerNotes  = repository.getAutoSpeakerNotes(...this.#match.#id, this.color);
            this.ampNotes          = repository.getAmpNotes(...this.#match.#id, this.color);
            this.speakerNotes      = repository.getSpeakerNotes(...this.#match.#id, this.color);
            this.ampedSpeakerNotes = repository.getAmpedSpeakerNotes(...this.#match.#id, this.color);
            this.coopertition      = repository.getCoopertition(...this.#match.#id, this.color);
            this.stage             = repository.getStage(...this.#match.#id, this.color);
            this.trapNotes         = repository.getTrapNotes(...this.#match.#id, this.color);
            this.harmony           = repository.getHarmony(...this.#match.#id, this.color);
            this.fouls             = repository.getFouls(...this.#match.#id, this.color);
            this.techFouls         = repository.getTechFouls(...this.#match.#id, this.color);
        }

        save() {
            repository.setMatchPoints(this.matchPoints, ...this.#match.#id, this.color);
            repository.setLeaves(this.leaves, ...this.#match.#id, this.color);
            repository.setAutoAmpNotes(this.autoAmpNotes, ...this.#match.#id, this.color);
            repository.setAutoSpeakerNotes(this.autoSpeakerNotes, ...this.#match.#id, this.color);
            repository.setAmpNotes(this.ampNotes, ...this.#match.#id, this.color);
            repository.setSpeakerNotes(this.speakerNotes, ...this.#match.#id, this.color);
            repository.setAmpedSpeakerNotes(this.ampedSpeakerNotes, ...this.#match.#id, this.color);
            repository.setCoopertition(this.coopertition, ...this.#match.#id, this.color);
            repository.setStage(this.stage, ...this.#match.#id, this.color);
            repository.setTrapNotes(this.trapNotes, ...this.#match.#id, this.color);
            repository.setHarmony(this.harmony, ...this.#match.#id, this.color);
            repository.setFouls(this.fouls, ...this.#match.#id, this.color);
            repository.setTechFouls(this.techFouls, ...this.#match.#id, this.color);
            repository.setMelody(this.melody, ...this.#match.#id, this.color);
            repository.setEnsemble(this.ensemble, ...this.#match.#id, this.color);
        }
        
        clear() {
            leaves = 0;
            autoAmpNotes = 0;
            autoSpeakerNotes = 0;
            ampNotes = 0;
            ampCharge = 0;
            speakerNotes = 0;
            ampedSpeakerNotes = 0;
            notesToAmpExpiry = 4;
            coopertition = false;
            stage = [0, 0, 0];
            trapNotes = [false, false, false];
            harmony = 0;
            fouls = 0;
            techFouls = 0;
        }
    }
}