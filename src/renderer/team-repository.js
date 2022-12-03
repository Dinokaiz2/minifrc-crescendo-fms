/**
 * Saves and retrieves team data from the database.
 * 
 * Notes: 
 *  - We should support disqualifications and surrogates, but an option is to do it by manually editing the
 *      database.
 */

import { Team } from "./team.js"

// Put manual db generation here
function generate() {
    generateTeam(1, "");
    generateTeam(2, "");
    generateTeam(3, "");
    generateTeam(4, "");
    generateTeam(5, "");
    generateTeam(6, "");
    generateTeam(7, "");
    generateTeam(8, "");
    generateTeam(9, "");
    generateTeam(10, "");
    generateTeam(11, "");
    generateTeam(12, "");
    generateTeam(13, "");
    generateTeam(14, "");
    generateTeam(15, "");
    generateTeam(16, "");
    generateTeam(17, "");
    generateTeam(18, "");
    generateTeam(19, "");
    generateTeam(20, "");
    generateTeam(21, "");
    generateTeam(22, "");
}

$(generate);

export function generateTeam(number, name) {
    if (Object.keys(window.teamDb.findOne({ Number: number })) == 0) {
        window.teamDb.save({ Number: number, Name: name });
    }
}

/**
 * @return {Team[]}
 */
export function getAllTeams() {
    let teams = window.teamDb.findAll();
    teams.forEach((e, i, a) => a[i] = new Team(e.Number));
    return teams;
}

export function getTeamName(number) {
    return window.teamDb.findOne({ Number: number }).Name;
}