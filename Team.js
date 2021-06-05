import * as teamRepository from "./team-repository.js"
import * as matchRepository from "./match-repository.js"

/**
 * Holds team data. Uses `number` as a unique identifier.
 * Roughly keeps track of the same fields as The Blue Alliance's Rankings page.
 */
export class Team {

    #number;

    constructor(number) {
        this.#number = number;
    }

    get number() {
        return this.#number;
    }

    get name() {
        return teamRepository.getName(number);
    }

    get rankingScore() {
        // Calculate:
        // Get all matches from matchRepository.getAllMatchNames
        // Keep only qualification matches with determined outcomes
        // Keep only matches with this team where this team isn't a surrogate
        // Add up ranking points, with 0s for DQs
    }

    get rankingPoints() {
        // Calculate from matches
    }

    get foulPoints() {
        // Calculate from matches
    }

    get autoPoints() {
        // Calculate from matches
    }

    get endgamePoints() {
        // Calculate from matches
    }

    get teleopPowerCellPoints() {
        // Calculate from matches
    }

    get controlPanelPoints() {
        // Calculate from matches
    }

    get disqualifications() {
        // Calculate from matches
    }

    get matchesPlayed() {
        // Calculate from matches
    }
}
