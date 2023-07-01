let CtrlMsg = {
    VIEW_MATCH:                 "view-match",
    VIEW_RESULTS:               "view-results",
    VIEW_RANKINGS:              "view-rankings",
    NO_ENTRY:                   "no-entry",
    SAFE_TO_ENTER:              "safe-to-enter",
    READY_FOR_MATCH:            "ready-for-match",
    START_MATCH:                "start-match",
    FIELD_FAULT:                "field-fault",
    REPLAY_MATCH:               "replay-match",
    SAVE_RESULTS:               "save-results",
    NEXT_MATCH:                 "next-match",
    PREVIOUS_MATCH:             "previous-match",

    MOBILITY:                   "mobility",     // Params: { red: bool, count: 0-3 }
    AUTO_CHARGE:                "auto-charge",  // Params: { red: bool, level: (0-2) = (none, dock, engage) }
    NODE:                       "node",         // Params: { red: bool, level: (0-2) = (low, mid, high), auto: bool, undo: bool }
    LINK:                       "link",         // Params: { red: bool, undo: bool }
    COOPERTITION:               "coopertition", // Params: { red: bool, undo: bool }
    ENDGAME:                    "endgame",      // Params: { red: bool, position: 0-2, level: (0-3) = (none, park, dock, engage) }
    FOUL:                       "foul",         // Params: { red: bool, tech: bool, undo: bool }
}

let RenderMsg = {
    LOADED_UNDETERMINED_MATCH:  "loaded-undetermined-match",
    LOADED_DETERMINED_MATCH:    "loaded-determined-match",
    MATCH_ENDED:                "match-ended",
    MATCH_DATA:                 "match-data",
}

module.exports = { CtrlMsg, RenderMsg };