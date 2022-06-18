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
    RED_DISMOUNT:               "red-dismount", // Params: [0-2], level
    BLUE_DISMOUNT:              "blue-dismount", // Params: [0-2], level
    RED_CLIMB:                  "red-climb", // Params: [0-2], level
    BLUE_CLIMB:                 "blue-climb", // Params: [0-2], level
    GAME_PIECE:                 "game-piece", // Params: ["red", "blue"], idx, remove
    ADD_RED_FOUL:               "add-red-foul",
    REMOVE_RED_FOUL:            "remove-red-foul",
    ADD_BLUE_FOUL:              "add-blue-foul",
    REMOVE_BLUE_FOUL:           "remove-blue-foul",
    ADD_RED_TECH_FOUL:          "add-red-tech-foul",
    REMOVE_RED_TECH_FOUL:       "remove-red-tech-foul",
    ADD_BLUE_TECH_FOUL:         "add-blue-tech-foul",
    REMOVE_BLUE_TECH_FOUL:      "remove-blue-tech-foul",
}

let RenderMsg = {
    LOADED_UNDETERMINED_MATCH:  "loaded-undetermined-match",
    LOADED_DETERMINED_MATCH:    "loaded-determined-match",
    MATCH_ENDED:                "match-ended",
    MATCH_DATA:                 "match-data",
}

module.exports = { CtrlMsg, RenderMsg };