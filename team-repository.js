/**
 * Saves and retrieves team data from the database.
 * 
 * Notes: 
 *  - We should support disqualifications and surrogates, but an option is to do it by manually editing the
 *      database.
 */

import { Team } from "./team.js"

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