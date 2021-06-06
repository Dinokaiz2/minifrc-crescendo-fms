/**
 * Main file for communicating with FMS electronics and updating database.
 */

import { FmsFirmware } from "./fms-firmware.js"

import { Match } from "./match.js";

// Pre-match initialization: If qualifications, pull from schedule. For playoffs, generate the next match.

const AUTO_GRACE_PERIOD_START = 15;
const TELEOP_START = 20;
const ENDGAME_START = 120;
const TELEOP_GRACE_PERIOD_START = 150;
const MATCH_END = 155;

const AUTO_LENGTH = 15;
const TELEOP_LENGTH = 135;

// TODO: add a postMatch variable, true if we finished a match but haven't announced it?

export class Competition {
    static #inMatch = false;
    static #fieldPhase = Competition.FieldPhase.NO_ENTRY;
    static #match;

    static #matchStartDate;
    static #startAutoGracePeriodHandle;
    static #startTeleopHandle;
    static #startEndgameHandle;
    static #startTeleopGracePeriodHandle;
    static #endMatchHandle;

    // Example flow on boot:
    // NO_ENTRY > SAFE_TO_ENTER (set up match) > READY_FOR_MATCH (just before match)
    // > AUTO > TELEOP > ENDGAME > NO_ENTRY (all automatic after starting match)
    static get FieldPhase() {
        return {
            NO_ENTRY: 1,
            SAFE_TO_ENTER: 2,
            READY_FOR_MATCH: 3, // TODO: Must announce score/replay match before ready to start next match
            AUTO: 4,
            AUTO_GRACE_PERIOD: 5,
            TELEOP: 6,
            ENDGAME: 7,
            TELEOP_GRACE_PERIOD: 8
        };
    }

    /**
     * Load the first match of the competition whose outcome is still undetermined.
     */
    static loadMatch() {
        // TODO: only allow in some field phases?
        Competition.#match = Match.getNextMatch();
    }
    
    static nextMatch() {

    }

    static previousMatch() {

    }

    static #startAutoGracePeriod() {
        Competition.#fieldPhase = Competition.FieldPhase.AUTO_GRACE_PERIOD;
    }

    static #startTeleop() {
        Competition.#fieldPhase = Competition.FieldPhase.TELEOP;
        // TODO: Play teleop start sound
    }

    static #startEndgame() {
        Competition.#fieldPhase = Competition.FieldPhase.ENDGAME;
        // TODO: Play endgame start sound
    }

    static #startTeleopGracePeriod() {
        Competition.#inMatch = false;
        Competition.#fieldPhase = Competition.FieldPhase.TELEOP_GRACE_PERIOD;
    }

    static #endMatch() {
        Competition.#inMatch = false;
        Competition.#endMatchHandle = null;
        // TODO: Play match end sound
    }

    static startMatch() {
        Competition.#inMatch = true;
        Competition.#fieldPhase = Competition.FieldPhase.AUTO;
        Competition.#matchStartDate = new Date();

        Competition.#startAutoGracePeriodHandle = setTimeout(Competition.#startAutoGracePeriod, AUTO_GRACE_PERIOD_START * 1000);
        Competition.#startTeleopHandle = setTimeout(Competition.#startTeleop, TELEOP_START * 1000);
        Competition.#startEndgameHandle = setTimeout(Competition.#startEndgame, ENDGAME_START * 1000);
        Competition.#startTeleopGracePeriodHandle = setTimeout(Competition.#startTeleopGracePeriod, TELEOP_GRACE_PERIOD_START * 1000);
        Competition.#endMatchHandle = setTimeout(Competition.#endMatch, MATCH_END * 1000);
        // TODO: Play match start sound
    }

    static fieldFault() {
        Competition.#inMatch = false;
        clearTimeout(Competition.#startAutoGracePeriodHandle);
        clearTimeout(Competition.#startTeleopHandle);
        clearTimeout(Competition.#startEndgameHandle);
        clearTimeout(Competition.#startTeleopGracePeriodHandle);
        clearTimeout(Competition.#endMatchHandle);
        // TODO: Play field fault sound
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
     * True number of milliseconds since the match started. -1 if not in a match.
     * @type {number}
     */
    static get matchMillisElapsed() {
        if (!Competition.#inMatch) return -1;
        return new Date().getTime() - Competition.#matchStartDate.getTime();
    }

    static get inMatch() {
        return Competition.#inMatch;
    }

    static get inAuto() {
        return Competition.fieldPhase == Competition.FieldPhase.AUTO;
    }

    static get inTeleop() {
        return Competition.fieldPhase == Competition.FieldPhase.AUTO_GRACE_PERIOD
            || Competition.fieldPhase == Competition.FieldPhase.TELEOP
            || Competition.fieldPhase == Competition.FieldPhase.ENDGAME;
    }

    static get inEndgame() {
        return Competition.fieldPhase == Competition.FieldPhase.ENDGAME;
    }

    /**
     * @type {Competition.FieldPhase}
     */
    static get fieldPhase() {
        return Competition.#fieldPhase
    }
}

/**
 * Refreshes the state of the field. Should be called as often as communication with the
 * FMS electronics should happen.
 */
function update() {
    FmsFirmware.update();
}

// Check FMS firmware stream 50 times per second, starting when this module is imported
// TODO: make sure this doesn't get called more than once when imported multiple times?
setInterval(update, 20);
console.log("Started updating FMS firmware.");

// Idea: separate window for control instead of cryptic hotkeys
// Planned states:
// NO_ENTRY: Fouls, Endgame, Announce score, Replay match, Safe to enter field
// SAFE_TO_ENTER: Announce score, Replay match, Not safe to enter field, Ready for next match (must announce/replay first)
// READY_FOR_MATCH: Start match, Safe to enter field
// AUTO: Fouls, Field fault
// TELEOP: Fouls, Endgame, Field fault
// ENDGAME: Fouls, Endgame, Field fault

// Expose functions to get UI info

// field.js - Keeps track of FMS electronics state and sends relevant data
// user-input.js - Gets user input OR control-window.js receives user input from separate control window
// sound.js - sound effects


// get game state from electronics
// get game state from control window
// get field state transitions from control window
// keep the Match updated with that info

// ui in renderer.js just needs to know current match and field state, rest of the state it can pull straight from the match