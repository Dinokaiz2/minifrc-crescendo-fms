/**
 * Main file for communicating with FMS electronics and updating database.
 */

import { FmsFirmware } from "./fms-firmware.js"
import * as matchRepository from "./match-repository.js"
import * as teamRepository from "./team-repository.js"
import { Match } from "./match.js";
import * as userInput from "./user-input.js";
import * as sound from "./sound.js";

// Pre-match initialization: If qualifications, pull from schedule. For playoffs, generate the next match.

const DEBUG_FAST_MATCH = 1; // Match length multiplier for fast debugging

const TELEOP_START = 15 * DEBUG_FAST_MATCH;
const ENDGAME_START = 120 * DEBUG_FAST_MATCH;
const MATCH_END = 150 * DEBUG_FAST_MATCH;

const AUTO_LENGTH = 15 * DEBUG_FAST_MATCH;
const TELEOP_LENGTH = 135 * DEBUG_FAST_MATCH;

// TODO: add a postMatch variable, true if we finished a match but haven't announced it?

export class Competition {
    static #view = Competition.View.MATCH;
    static #fieldPhase = Competition.FieldPhase.NO_ENTRY;
    static #inMatch = false;
    static #matchOver = false; // True if match has ended
    static #resultsShown = false; // True if match has already shown results
    static #match;
    static #results;
    static #previousRankings;
    static #rankings;

    static #matchStartDate;
    static #startTeleopHandle;
    static #startEndgameHandle;
    static #endMatchHandle;

    // Example flow on boot:
    // NO_ENTRY > SAFE_TO_ENTER (set up match) > READY_FOR_MATCH (just before match)
    // > AUTO > TELEOP > ENDGAME > NO_ENTRY (all automatic after starting match)
    static get FieldPhase() {
        return {
            NO_ENTRY: 1,
            SAFE_TO_ENTER: 2,
            READY_FOR_MATCH: 3, // TODO: Must announce score/replay match before ready to start next match
            AUTO: 5,
            TELEOP: 6,
            ENDGAME: 7,
        };
    }

    static get View() {
        return {
            MATCH: 1,
            RESULTS: 2,
            RANKINGS: 3,
            PREVIEW: 4
        }
    }

    /**
     * @type {Match}
     */
    static get match() {
        return this.#match;
    }

    /** @type {Match} */
    static get results() {
        return this.#results;
    }

    static begin() {
        setInterval(() => Competition.update(), 100);
        // Wait before loading match so control window is ready
        setTimeout(() => Competition.loadNextMatch(), 1000);
        console.log("Controller started.");
    }

    /**
     * Refreshes the state of the field. Should be called as often as communication with the
     * FMS electronics should happen.
     */
    static update() {
        // FmsFirmware.update(Competition.fieldPhase);
        if (this.match) userInput.sendMatchData();
    }

    static #loadMatch(match) {
        this.#match = match;
        if (this.#match.result == Match.Result.UNDETERMINED) {
            userInput.loadedUndeterminedMatch();
            this.#matchOver = false;
            this.#resultsShown = false;
        } else {
            userInput.loadedDeterminedMatch();
            this.#matchOver = true;
            this.#resultsShown = true;
        }
    }

    /**
     * Load the first match of the competition whose outcome is still undetermined.
     */
    static loadNextMatch() {
        this.#loadMatch(Match.getNextMatch());
    }

    static previousMatch() {
        let matches = Match.getSortedMatches();
        let index = matches.findIndex(m => m.number == this.match.number && m.set == this.match.set && m.type == this.match.type);
        this.#loadMatch(matches[Math.max(index - 1, 0)]);
    }

    static nextMatch() {
        let matches = Match.getSortedMatches();
        let index = matches.findIndex(m => m.number == this.match.number && m.set == this.match.set && m.type == this.match.type);
        this.#loadMatch(matches[Math.min(index + 1, matches.length - 1)]);
    }

    static #startAuto() {
        Competition.#fieldPhase = Competition.FieldPhase.AUTO;
    }

    static #startTeleop() {
        Competition.#fieldPhase = Competition.FieldPhase.TELEOP;
        sound.startTeleop()
    }

    static #startEndgame() {
        Competition.#fieldPhase = Competition.FieldPhase.ENDGAME;
        sound.startEndgame()
    }

    static #endMatch() {
        Competition.#inMatch = false;
        Competition.#endMatchHandle = null;
        Competition.#matchOver = true;
        userInput.matchEnded();
        sound.endMatch();
    }

    static startMatch() {
        Competition.#inMatch = true;
        Competition.#matchStartDate = new Date();

        Competition.#startTeleopHandle = setTimeout(() => Competition.#startTeleop(), TELEOP_START * 1000);
        Competition.#startEndgameHandle = setTimeout(() => Competition.#startEndgame(), ENDGAME_START * 1000);
        Competition.#endMatchHandle = setTimeout(() => Competition.#endMatch(), MATCH_END * 1000);

        this.#startAuto();
        sound.startMatch();
    }

    static fieldFault() {
        FmsFirmware.acceptingInput = false;
        this.#inMatch = false;
        this.#matchOver = true;
        this.#resultsShown = true;
        clearTimeout(Competition.#startTeleopHandle);
        clearTimeout(Competition.#startEndgameHandle);
        clearTimeout(Competition.#endMatchHandle);
        sound.fieldFault();
    }

    static replayMatch() {
        this.#matchOver = false;
        this.#resultsShown = false;
        this.match.clear();
        this.readyForMatch();
    }

    static saveResults() {
        this.#previousRankings = this.rankings;
        this.#match.determineResult();
        this.#match.save();
        this.#rankings = this.calculateRankings();
        this.#results = this.#match;
    }

    static showMatch() {
        this.#view = Competition.View.MATCH;
    }

    static showResults() {
        this.#view = Competition.View.RESULTS;
        this.#resultsShown = true;
        this.loadNextMatch();
        sound.showResults();
    }

    static showRankings() {
        this.#view = Competition.View.RANKINGS;
    }

    static calculateRankings() {
        let teams = teamRepository.getAllTeams();
        teams.forEach(team => team.calculateFields());
        teams.sort((t1, t2) => {
            // Stable sort for NaN ranking scores
            if (isNaN(t1.rankingScore) && !isNaN(t2.rankingScore)) return 1;
            if (!isNaN(t1.rankingScore) && isNaN(t2.rankingScore)) return -1;
            if (isNaN(t1.rankingScore) && isNaN(t2.rankingScore)) return t1.number - t2.number; // Use lower team number for stable sort if ranking score NaN
            if (t1.rankingScore != t2.rankingScore) return t2.rankingScore - t1.rankingScore;
            if (t1.autoPoints != t2.autoPoints) return t2.autoPoints - t1.autoPoints;
            return t2.stagePoints - t1.stagePoints;
        });
        return teams;
    }

    static noEntry() {
        this.#fieldPhase = Competition.FieldPhase.NO_ENTRY;
    }

    static safeToEnter() {
        this.#fieldPhase = Competition.FieldPhase.SAFE_TO_ENTER;
    }

    static readyForMatch() {
        this.#fieldPhase = Competition.FieldPhase.READY_FOR_MATCH;
        FmsFirmware.acceptingInput = true;
    }

    static get rankings() {
        if (!this.#rankings) this.#rankings = this.calculateRankings();
        return this.#rankings;
    }

    static get previousRankings() {
        return this.#previousRankings;
    }

    /**
     * Friendly display for the match time. Counts down from 15 during autonomous
     * and then back down from 135 once teleop starts. -1 if not in a match.
     * @type {string}
     */
    static get friendlyMatchTime() {
        if (Competition.inMatch && Competition.inAuto) {
            let time = AUTO_LENGTH - ((new Date().getTime() - Competition.#matchStartDate.getTime()) / 1000);
            return Math.max(0, Math.ceil(time));
        } else if (Competition.inMatch && Competition.inTeleop) {
            let time = TELEOP_LENGTH - (((new Date().getTime() - Competition.#matchStartDate.getTime()) / 1000) - AUTO_LENGTH);
            return time < 9.95 ? Math.abs(time).toFixed(1) : Math.ceil(time);
        }
    }

    /**
     * Number of milliseconds since the match started. -1 if not in a match.
     * @type {number}
     */
    static get matchMillisElapsed() {
        if (!Competition.#inMatch) return -1;
        return new Date().getTime() - Competition.#matchStartDate.getTime();
    }

    static get inMatch() {
        return Competition.#inMatch;
    }

    static get matchOver() {
        return this.#matchOver;
    }

    /**
     * True if match has ended but results have not yet been shown.
     */
    static get postMatch() {
        return this.#matchOver && !this.#resultsShown;
    }

    static get inAuto() {
        return Competition.fieldPhase == Competition.FieldPhase.AUTO;
    }

    static get inTeleop() {
        return Competition.fieldPhase == Competition.FieldPhase.TELEOP
            || Competition.fieldPhase == Competition.FieldPhase.ENDGAME;
    }

    static get inEndgame() {
        return Competition.fieldPhase == Competition.FieldPhase.ENDGAME;
    }

    /**
     * @type {Competition.FieldPhase}
     */
    static get fieldPhase() {
        return Competition.#fieldPhase;
    }

    /**
     * @type {Competition.View}
     */
    static get view() {
        return Competition.#view;
    }
}