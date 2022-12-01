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

    AUTO:                       "auto",    // Params: { red: bool, position: (0-2), level: (0-2) = (none, reach, cross) }
    DEFENSE:                    "defense", // Params: { red: bool, position: (0-4), undo: bool }
    BOULDER:                    "boulder", // Params: { red: bool, high: bool, auto: bool, undo: bool }
    ENDGAME:                    "endgame", // Params: { red: bool, position: (0-2), level: (0-2) = (none, challenge, scale) }
    FOUL:                       "foul",    // Params: { red: bool, tech: bool, undo: bool }
}

let RenderMsg = {
    LOADED_UNDETERMINED_MATCH:  "loaded-undetermined-match",
    LOADED_DETERMINED_MATCH:    "loaded-determined-match",
    MATCH_ENDED:                "match-ended",
    MATCH_DATA:                 "match-data",
}

module.exports = { CtrlMsg, RenderMsg };