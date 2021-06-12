/**
 * Saves and retrieves match data from a database.
 * 
 * Notes:
 *  - We need to support match replays somehow. A good solution might be just rolling
 *      back the database if a replay is needed.
 */

import { Match } from "./match.js"

// const location = window.db.createLocation();
// var db = window.db.database(location);

window.onload = () => {
    // generateMatch(2, 0, Match.Type.QUALIFICATION, [0, 1, 2], [3, 4, 5], "red team", "blue team");
    // setMatchPoints(33, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED);
    // setMatchPoints(46, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE);
    // setRegularFouls(6, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED);
    // setRegularFouls(10, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE);
    // setTechFouls(5, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED);
    // setTechFouls(2, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE);
    // setAutoBottomPort(2, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED);
    // setAutoBottomPort(0, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE);
    // setAutoUpperPort(3, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED);
    // setAutoUpperPort(9, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE);
    // setTeleopBottomPort(15, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED);
    // setTeleopBottomPort(4, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE);
    // setTeleopUpperPort(12, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED);
    // setTeleopUpperPort(35, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE);
    // setInitiationLine(2, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED);
    // setInitiationLine(3, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE);
    // setParks(1, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED);
    // setParks(2, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE);
    // setHangs(2, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED);
    // setHangs(1, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE);
    // setLevel(true, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED);
    // setLevel(false, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE);
    // setPhase(Match.Phase.PHASE_1, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED);
    // setPhase(Match.Phase.PHASE_3, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE);
    // setPowerCellsInPhase(6, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED);
    // setPowerCellsInPhase(20, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE);
    // setShieldGeneratorEnergized(true, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED);
    // setShieldGeneratorEnergized(false, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE);
    // setShieldGeneratorOperational(true, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED);
    // setShieldGeneratorOperational(true, 2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE);
    // setResult(Match.Result.RED_WIN, 2, 0, Match.Type.QUALIFICATION);

    // console.log("get red match points", getMatchPoints(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED));
    // console.log("get red reg fouls", getRegularFouls(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED));
    // console.log("get red tech fouls", getTechFouls(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED));
    // console.log("get red auto bottom", getAutoBottomPort(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED));
    // console.log("get red auto top", getAutoUpperPort(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED));
    // console.log("get red teleop bottom", getTeleopBottomPort(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED));
    // console.log("get red teleop top", getTeleopUpperPort(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED));
    // console.log("get red initiation", getInitiationLine(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED));
    // console.log("get red parks", getParks(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED));
    // console.log("get red hangs", getHangs(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED));
    // console.log("get red level", getLevel(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED));
    // console.log("get red phase", getPhase(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED));
    // console.log("get red power cells in phase", getPowerCellsInPhase(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED));
    // console.log("get red shield gen operational", getShieldGeneratorOperational(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED));
    // console.log("get red shield gen energized", getShieldGeneratorEnergized(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.RED));

    // console.log("get blue match points", getMatchPoints(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE));
    // console.log("get BLUE reg fouls", getRegularFouls(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE));
    // console.log("get BLUE tech fouls", getTechFouls(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE));
    // console.log("get BLUE auto bottom", getAutoBottomPort(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE));
    // console.log("get BLUE auto top", getAutoUpperPort(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE));
    // console.log("get BLUE teleop bottom", getTeleopBottomPort(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE));
    // console.log("get BLUE teleop top", getTeleopUpperPort(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE));
    // console.log("get BLUE initiation", getInitiationLine(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE));
    // console.log("get BLUE parks", getParks(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE));
    // console.log("get BLUE hangs", getHangs(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE));
    // console.log("get BLUE level", getLevel(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE));
    // console.log("get BLUE phase", getPhase(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE));
    // console.log("get BLUE power cells in phase", getPowerCellsInPhase(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE));
    // console.log("get BLUE shield gen operational", getShieldGeneratorOperational(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE));
    // console.log("get BLUE shield gen energized", getShieldGeneratorEnergized(2, 0, Match.Type.QUALIFICATION, Match.AllianceColor.BLUE));

    // console.log("get results", getResult(2, 0, Match.Type.QUALIFICATION));
    // console.log("get Surrogate", isSurrogate(0, 2, 0, Match.Type.QUALIFICATION));
    // console.log("get Disqualified", isDisqualified(0, 2, 0, Match.Type.QUALIFICATION));
    // console.log("get all matches", getAllMatches());

};


/**
 * Builds and returns an array of all matches.
 * @return {Match[]}
 */
export function getAllMatches() {
    let matches = window.db.findAll();
    matches.forEach((e, i, a) => a[i] = new Match(e.Number, e.Type, e.Set));
    return matches;
}

/**
 * Gets the red team numbers in the match with the specified number, type, and set.
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @return {number[]} an array of three red team numbers
 */
export function getRedTeams(number, set, type) {
    return window.db.findOne({ Number: number, Set: set, Type: type }).RedTeams;
}

/**
 * Gets the blue team numbers in the match with the specified number, type, and set.
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @return {number[]} an array of three blue team numbers
 */
export function getBlueTeams(number, set, type) {
    return window.db.findOne({ Number: number, Set: set, Type: type }).BlueTeams;
}

/**
 * Returns the result of the match with the specified number, type, and set.
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @return {Match.Result} the match result (Match.Result.UNDETERMINED if not yet played)
 */
export function getResult(number, set, type) {

    return window.db.findOne({ Number: number, Set: set, Type: type }).Results;

}

/**
 * Set the result of a match.
 * @param {Match.Result} result 
 * @param {number} number 
 * @param {number} set 
 * @param {Match.Type} type 
 */
export function setResult(result, number, set, type) {

    let where = {
        Number: number,
        Set: set,
        Type: type
    };

    window.db.update(window.db.findOne(where).id, { Results: result });

}

/**
 * Checks if the specified team was disqualified from this match. Behavior is undefined
 * if called with a team number not in specified match.
 * @param {number} teamNumber the team number to check for disqualification
 * @param {number} matchNumber the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @return {boolean} whether the team was disqualified from this match
 */
export function isDisqualified(teamNumber, matchNumber, set, type) {
    return window.db.findOne({ Number: matchNumber, Set: set, Type: type }).Disqualifications.includes(teamNumber);
}

/**
 * Checks if the specified team is a surrogate in this match. Behavior is undefined
 * if called with a team number not in specified match.
 * @param {number} teamNumber the team number to check for surrogacy
 * @param {number} matchNumber the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 */
export function isSurrogate(teamNumber, matchNumber, set, type) {
    return window.db.findOne({ Number: matchNumber, Set: set, Type: type }).Surrogates.includes(teamNumber);
}

/**
 * Creates a new match to be played and puts it in the database. Does not add the match
 * if a match with the same number, set, and type is already in the database.
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {number[]} redTeams an array of three team numbers
 * @param {number[]} blueTeams an array of three team number
 * @param {string} redAllianceName name to use for the red alliance in a playoff match
 * @param {string} blueAllianceName name to use for the blue alliance in a playoff match
 */
export function generateMatch(number, set, type, redTeams, blueTeams,
    redAllianceName = "", blueAllianceName = "") {
    console.log("Generate Match")

    if (Object.keys(window.db.findOne({ Number: number, Set: set, Type: type })) == 0)
        window.db.save(
            {
                Number: number,
                Set: set,
                Type: type,
                RedTeams: redTeams,
                BlueTeams: blueTeams,
                RedAllianceName: redAllianceName,
                BlueAllianceName: blueAllianceName,
                Disqualifications: [],
                Surrogates: [],
                MatchPointsBlue: 0,
                MatchPointsRed: 0,
                Results: Match.Result.UNDETERMINED,

                RegularFoulsBlue: 0,
                TechFoulsBlue: 0,
                InitiationLineBlue: 0,
                AutoUpperPortBlue: 0,
                AutoBottomPortBlue: 0,
                TeleopBottomPortBlue: 0,
                TeleopUpperPortBlue: 0,
                ParksBlue: 0,
                HangsBlue: 0,
                LevelBlue: false,
                PhaseBlue: Match.Phase.NONE,
                PositionControlTargetBlue: Match.ControlPanel.NO_COLOR,
                PowerCellsInPhaseBlue: 0,
                ShieldGenOperationalBlue: false,
                ShieldGenEnergizedBlue: false,
                
                RegularFoulsRed: 0,
                TechFoulsRed: 0,
                InitiationLineRed: 0,
                AutoUpperPortRed: 0,
                AutoBottomPortRed: 0,
                TeleopBottomPortRed: 0,
                TeleopUpperPortRed: 0,
                ParksRed: 0,
                HangsRed: 0,
                LevelRed: false,
                PhaseRed: Match.Phase.NONE,
                PositionControlTargetRed: Match.ControlPanel.NO_COLOR,
                PowerCellsInPhaseRed: 0,
                ShieldGenOperationalRed: false,
                ShieldGenEnergizedRed: false


            }
        );
}

/**
 * Gets the number of match points scored by the specified alliance in the match.
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {Match.AllianceColor} color the alliance to get the value for
 * @return {number} the number of match points for this match
 */
export function getMatchPoints(number, set, type, color) {

    let points = 0;

    if (color == Match.AllianceColor.BLUE)
        points = window.db.findOne({ Number: number, Set: set, Type: type }).MatchPointsBlue;
    else if (color == Match.AllianceColor.RED)
        points = window.db.findOne({ Number: number, Set: set, Type: type }).MatchPointsRed;
    return points;

}


/**
 * Sets the number of match points scored by the specified alliance in the match.
 * @param {number} points the number of points to set
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {Match.AllianceColor} color the alliance to get the value for
 */
export function setMatchPoints(points, number, set, type, color) {
    let where = {
        Number: number,
        Set: set,
        Type: type
    };

    let change;

    if (color == Match.AllianceColor.BLUE)
        change = { MatchPointsBlue: points }
    else if (color == Match.AllianceColor.RED)
        change = { MatchPointsRed: points }

    window.db.update(window.db.findOne(where).id, change);
}

/**
 * Gets the number of initiation line crossings by the specified alliance in the match.
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {Match.AllianceColor} color the alliance to get the value for
 * @param {number} the number of initiation line crossings for this match
 */
export function getInitiationLine(number, set, type, color) {

    let crossed = 0;

    if (color == Match.AllianceColor.BLUE)
        crossed = window.db.findOne({ Number: number, Set: set, Type: type }).InitiationLineBlue;
    else if (color == Match.AllianceColor.RED)
        crossed = window.db.findOne({ Number: number, Set: set, Type: type }).InitiationLineRed;
    return crossed;

}

/**
 * Sets the number of initiation line crossings by the specified alliance in the match.
 * @param {number} crossings the number of initiation line crossings to set
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {Match.AllianceColor} color the alliance to get the value for
 */
export function setInitiationLine(crossings, number, set, type, color) {

    let where = {
        Number: number,
        Set: set,
        Type: type
    };

    let change;

    if (color == Match.AllianceColor.BLUE)
        change = { InitiationLineBlue: crossings }
    else if (color == Match.AllianceColor.RED)
        change = { InitiationLineRed: crossings }

    window.db.update(window.db.findOne(where).id, change);

}

export function getAutoBottomPort(number, set, type, color) {

    let powerCells = 0;

    if (color == Match.AllianceColor.BLUE)
        powerCells = window.db.findOne({ Number: number, Set: set, Type: type }).AutoBottomPortBlue;
    else if (color == Match.AllianceColor.RED)
        powerCells = window.db.findOne({ Number: number, Set: set, Type: type }).AutoBottomPortRed;
    return powerCells;

}

export function setAutoBottomPort(cells, number, set, type, color) {

    let where = {
        Number: number,
        Set: set,
        Type: type
    };

    let change;

    if (color == Match.AllianceColor.BLUE)
        change = { AutoBottomPortBlue: cells }
    else if (color == Match.AllianceColor.RED)
        change = { AutoBottomPortRed: cells }

    window.db.update(window.db.findOne(where).id, change);

}

export function getAutoUpperPort(number, set, type, color) {

    let powerCells = 0;

    if (color == Match.AllianceColor.BLUE)
        powerCells = window.db.findOne({ Number: number, Set: set, Type: type }).AutoUpperPortBlue;
    else if (color == Match.AllianceColor.RED)
        powerCells = window.db.findOne({ Number: number, Set: set, Type: type }).AutoUpperPortRed;
    return powerCells;

}

export function setAutoUpperPort(cells, number, set, type, color) {

    let where = {
        Number: number,
        Set: set,
        Type: type
    };

    let change;

    if (color == Match.AllianceColor.BLUE)
        change = { AutoUpperPortBlue: cells }
    else if (color == Match.AllianceColor.RED)
        change = { AutoUpperPortRed: cells }

    window.db.update(window.db.findOne(where).id, change);

}

export function getTeleopBottomPort(number, set, type, color) {

    let powerCells = 0;

    if (color == Match.AllianceColor.BLUE)
        powerCells = window.db.findOne({ Number: number, Set: set, Type: type }).TeleopBottomPortBlue;
    else if (color == Match.AllianceColor.RED)
        powerCells = window.db.findOne({ Number: number, Set: set, Type: type }).TeleopBottomPortRed;
    return powerCells;

}

export function setTeleopBottomPort(cells, number, set, type, color) {

    let where = {
        Number: number,
        Set: set,
        Type: type
    };

    let change;

    if (color == Match.AllianceColor.BLUE)
        change = { TeleopBottomPortBlue: cells }
    else if (color == Match.AllianceColor.RED)
        change = { TeleopBottomPortRed: cells }

    window.db.update(window.db.findOne(where).id, change);

}

export function getTeleopUpperPort(number, set, type, color) {

    let powerCells = 0;

    if (color == Match.AllianceColor.BLUE)
        powerCells = window.db.findOne({ Number: number, Set: set, Type: type }).TeleopUpperPortBlue;
    else if (color == Match.AllianceColor.RED)
        powerCells = window.db.findOne({ Number: number, Set: set, Type: type }).TeleopUpperPortRed;
    return powerCells;

}

export function setTeleopUpperPort(cells, number, set, type, color) {

    let where = {
        Number: number,
        Set: set,
        Type: type
    };

    let change;

    if (color == Match.AllianceColor.BLUE)
        change = { TeleopUpperPortBlue: cells }
    else if (color == Match.AllianceColor.RED)
        change = { TeleopUpperPortRed: cells }

    window.db.update(window.db.findOne(where).id, change);

}

export function getParks(number, set, type, color) {

    let parks = 0;

    if (color == Match.AllianceColor.BLUE)
        parks = window.db.findOne({ Number: number, Set: set, Type: type }).ParksBlue;
    else if (color == Match.AllianceColor.RED)
        parks = window.db.findOne({ Number: number, Set: set, Type: type }).ParksRed;
    return parks;

}

export function setParks(parks, number, set, type, color) {

    let where = {
        Number: number,
        Set: set,
        Type: type
    };

    let change;

    if (color == Match.AllianceColor.BLUE)
        change = { ParksBlue: parks }
    else if (color == Match.AllianceColor.RED)
        change = { ParksRed: parks }

    window.db.update(window.db.findOne(where).id, change);

}

export function getHangs(number, set, type, color) {

    let hangs = 0;

    if (color == Match.AllianceColor.BLUE)
        hangs = window.db.findOne({ Number: number, Set: set, Type: type }).HangsBlue;
    else if (color == Match.AllianceColor.RED)
        hangs = window.db.findOne({ Number: number, Set: set, Type: type }).HangsRed;
    return hangs;

}

export function setHangs(hangs, number, set, type, color) {

    let where = {
        Number: number,
        Set: set,
        Type: type
    };

    let change;

    if (color == Match.AllianceColor.BLUE)
        change = { HangsBlue: hangs }
    else if (color == Match.AllianceColor.RED)
        change = { HangsRed: hangs }

    window.db.update(window.db.findOne(where).id, change);

}

/**
 * Checks if the alliance's rung was level.
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {Match.AllianceColor} color the alliance to get the value for
 * @return {boolean} `true` if the rung was level
 */
export function getLevel(number, set, type, color) {

    let level = false;

    if (color == Match.AllianceColor.BLUE)
        level = window.db.findOne({ Number: number, Set: set, Type: type }).LevelBlue;
    else if (color == Match.AllianceColor.RED)
        level = window.db.findOne({ Number: number, Set: set, Type: type }).LevelRed;
    return level;

}

/**
 * Sets if the alliance's rung was level.
 * @param {boolean} level whether the rung was level
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {Match.AllianceColor} color the alliance to get the value for
 */
export function setLevel(level, number, set, type, color) {

    let where = {
        Number: number,
        Set: set,
        Type: type
    };

    let change;

    if (color == Match.AllianceColor.BLUE)
        change = { LevelBlue: level }
    else if (color == Match.AllianceColor.RED)
        change = { LevelRed: level }

    window.db.update(window.db.findOne(where).id, change);
}

/**
 * Gets the highest Infinite Recharge phase the alliance has activated.
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {Match.AllianceColor} color the alliance to get the value for
 * @return {Match.Phase} the highest phase the alliance has activated
 */
export function getPhase(number, set, type, color) {

    let phase = Match.Phase.NONE;

    if (color == Match.AllianceColor.BLUE)
        phase = window.db.findOne({ Number: number, Set: set, Type: type }).PhaseBlue;
    else if (color == Match.AllianceColor.RED)
        phase = window.db.findOne({ Number: number, Set: set, Type: type }).PhaseRed;
    return phase;

}

/**
 * Sets the highest Infinite Recharge phase the alliance has activated.
 * @param {Match.Phase} phase the phase to set
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {Match.AllianceColor} color the alliance to get the value for
 */
export function setPhase(phase, number, set, type, color) {

    let where = {
        Number: number,
        Set: set,
        Type: type
    };

    let change;

    if (color == Match.AllianceColor.BLUE)
        change = { PhaseBlue: phase }
    else if (color == Match.AllianceColor.RED)
        change = { PhaseRed: phase }

    window.db.update(window.db.findOne(where).id, change);

}

export function getPositionControlTarget(number, set, type, color) {
    let target = Match.ControlPanel.NO_COLOR;

    if (color == Match.AllianceColor.BLUE)
        target = window.db.findOne({ Number: number, Set: set, Type: type }).PositionControlTargetBlue;
    else if (color == Match.AllianceColor.RED)
        target = window.db.findOne({ Number: number, Set: set, Type: type }).PositionControlTargetRed;
    return target;
}

export function setPositionControlTarget(value, number, set, type, color) {
    let where = {
        Number: number,
        Set: set,
        Type: type
    };

    let change;

    if (color == Match.AllianceColor.BLUE)
        change = { BluePositionControlTarget: value }
    else if (color == Match.AllianceColor.RED)
        change = { RedPositionControlTarget: value }

    window.db.update(window.db.findOne(where).id, change);
}

/**
 * Gets the number of power cells scored by the alliance in the current phase.
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {Match.AllianceColor} color the alliance to get the value for
 * @return {number} the number of power cells scored by the alliance in the current phase
 */
export function getPowerCellsInPhase(number, set, type, color) {

    let powerCellsInPhase = 0;

    if (color == Match.AllianceColor.BLUE)
        powerCellsInPhase = window.db.findOne({ Number: number, Set: set, Type: type }).PowerCellsInPhaseBlue;
    else if (color == Match.AllianceColor.RED)
        powerCellsInPhase = window.db.findOne({ Number: number, Set: set, Type: type }).PowerCellsInPhaseRed;
    return powerCellsInPhase;

}

/**
 * Sets the number of power cells scored by the alliance in the current phase.
 * @param {number} cells number of power cells to set
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {Match.AllianceColor} color the alliance to get the value for
 */
export function setPowerCellsInPhase(cells, number, set, type, color) {

    let where = {
        Number: number,
        Set: set,
        Type: type
    };

    let change;

    if (color == Match.AllianceColor.BLUE)
        change = { PowerCellsInPhaseBlue: cells }
    else if (color == Match.AllianceColor.RED)
        change = { PowerCellsInPhaseRed: cells }

    window.db.update(window.db.findOne(where).id, change);

}

/**
 * Gets the number of regular fouls awarded to the specified alliance as a result
 * of fouls committed by the opponent alliance in the match.
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {Match.AllianceColor} color the alliance to get the value for
 * @return {number} the number of regular fouls awarded in this match
 */
export function getRegularFouls(number, set, type, color) {

    let regularFouls = 0;

    if (color == Match.AllianceColor.BLUE)
        regularFouls = window.db.findOne({ Number: number, Set: set, Type: type }).RegularFoulsBlue;
    else if (color == Match.AllianceColor.RED)
        regularFouls = window.db.findOne({ Number: number, Set: set, Type: type }).RegularFoulsRed;
    return regularFouls;

}

/**
 * Sets the number of regular fouls awarded to the specified alliance as a result
 * of fouls committed by the opponent alliance in the match.
 * @param {number} fouls the number of regular fouls to set
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {Match.AllianceColor} color the alliance to get the value for
 */
export function setRegularFouls(fouls, number, set, type, color) {

    let where = {
        Number: number,
        Set: set,
        Type: type
    };

    let change;

    if (color == Match.AllianceColor.BLUE)
        change = { RegularFoulsBlue: fouls }
    else if (color == Match.AllianceColor.RED)
        change = { RegularFoulsRed: fouls }

    window.db.update(window.db.findOne(where).id, change);

}

/**
 * Gets the number of tech fouls awarded to the specified alliance as a result of
 * fouls committed by the opponent alliance in the match.
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {Match.AllianceColor} color the alliance to get the value for
 * @return {number} the number of tech fouls awarded in this match
 */
export function getTechFouls(number, set, type, color) {

    let techFouls = 0;

    if (color == Match.AllianceColor.BLUE)
        techFouls = window.db.findOne({ Number: number, Set: set, Type: type }).TechFoulsBlue;
    else if (color == Match.AllianceColor.RED)
        techFouls = window.db.findOne({ Number: number, Set: set, Type: type }).TechFoulsRed;
    return techFouls;

}

/**
 * Sets the number of tech fouls awarded to the specified alliance as a result of
 * fouls committed by the opponent alliance in the match.
 * @param {number} fouls the number of tech fouls to set
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {Match.AllianceColor} color the alliance to get the value for
 */
export function setTechFouls(fouls, number, set, type, color) {

    let where = {
        Number: number,
        Set: set,
        Type: type
    };

    let change;

    if (color == Match.AllianceColor.BLUE)
        change = { TechFoulsBlue: fouls }
    else if (color == Match.AllianceColor.RED)
        change = { TechFoulsRed: fouls }

    window.db.update(window.db.findOne(where).id, change);

}

/**
 * Checks if the Shield Generator Operational ranking point was awarded to the specified
 * alliance in the match.
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {Match.AllianceColor} color the alliance to get the value for
 * @return {boolean} whether the ranking point was awarded
 */
export function getShieldGeneratorOperational(number, set, type, color) {

    let shieldGenOperational = false;

    if (color == Match.AllianceColor.BLUE)
        shieldGenOperational = window.db.findOne({ Number: number, Set: set, Type: type }).ShieldGenOperationalBlue;
    else if (color == Match.AllianceColor.RED)
        shieldGenOperational = window.db.findOne({ Number: number, Set: set, Type: type }).ShieldGenOperationalRed;
    if (number == 1) console.log(shieldGenOperational);
    return shieldGenOperational;

}


/**
 * Sets if the Shield Generator Operational ranking point was awarded to the specified
 * alliance in the match.
 * @param {boolean} operational whether the ranking point was awarded
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {Match.AllianceColor} color the alliance to get the value for
 */
export function setShieldGeneratorOperational(operational, number, set, type, color) {

    let where = {
        Number: number,
        Set: set,
        Type: type
    };

    let change;

    if (color == Match.AllianceColor.BLUE)
        change = { ShieldGenOperationalBlue: operational }
    else if (color == Match.AllianceColor.RED)
        change = { ShieldGenOperationalRed: operational }

    window.db.update(window.db.findOne(where).id, change);

}

/**
 * Checks if the Shield Generator Energized ranking point was awarded to the specified
 * alliance in the match.
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {Match.AllianceColor} color the alliance to get the value for
 * @return {boolean} whether the ranking point was awarded
 */
export function getShieldGeneratorEnergized(number, set, type, color) {

    let shieldGenEnergized = false;

    if (color == Match.AllianceColor.BLUE)
        shieldGenEnergized = window.db.findOne({ Number: number, Set: set, Type: type }).ShieldGenEnergizedBlue;
    else if (color == Match.AllianceColor.RED)
        shieldGenEnergized = window.db.findOne({ Number: number, Set: set, Type: type }).ShieldGenEnergizedRed;
    return shieldGenEnergized;


}


/**
 * Sets if the Shield Generator Energized ranking point was awarded to the specified
 * alliance in the match.
 * @param {boolean} energized whether the ranking point was awarded
 * @param {number} number the match number
 * @param {number} set the set the match is apart of
 * @param {Match.Type} type the match type
 * @param {Match.AllianceColor} color the alliance to get the value for
 */
export function setShieldGeneratorEnergized(energized, number, set, type, color) {

    let where = {
        Number: number,
        Set: set,
        Type: type
    };

    let change;

    if (color == Match.AllianceColor.BLUE)
        change = { ShieldGenEnergizedBlue: energized }
    else if (color == Match.AllianceColor.RED)
        change = { ShieldGenEnergizedRed: energized }

    window.db.update(window.db.findOne(where).id, change);

}