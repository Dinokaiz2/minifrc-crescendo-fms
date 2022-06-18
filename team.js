import * as teamRepository from "./team-repository.js"
import * as matchRepository from "./match-repository.js"

import { Match } from "./match.js"

/**
 * Holds team data. Uses `number` as a unique identifier.
 * Roughly keeps track of the same fields as The Blue Alliance's Rankings page.
 */
export class Team {

    #number;
    #name;

    #rankingPoints;
    #autoPoints;
    #endgamePoints;
    #cargoPoints;
    #hatchPoints;
    #wins;
    #ties;
    #losses;
    #disqualifications;
    #matchesPlayed;

    constructor(number) {
        this.#number = number;
        this.#name = teamRepository.getTeamName(number);
    }

    get number() {
        return this.#number;
    }

    get name() {
        return this.#name;
    }

    calculateFields() {
        let matches = matchRepository.getAllMatches();
        matches = matches.filter(match => match.type == Match.Type.QUALIFICATION  && match.result != Match.Result.UNDETERMINED);
        matches = matches.filter(match => match.teamNumbers.includes(this.number) && !match.isSurrogate(this.number));
        this.#rankingPoints = 0;
        this.#autoPoints = 0;
        this.#endgamePoints = 0;
        this.#hatchPoints = 0;
        this.#cargoPoints = 0;
        this.#wins = 0;
        this.#ties = 0;
        this.#losses = 0;
        this.#disqualifications = 0;
        matches.forEach(match => {
            if (match.isDisqualified(this.number)) {
                this.#disqualifications++;
            } else {
                if (match.red.teamNumbers.includes(this.number)) {
                    if (match.result == Match.Result.RED_WIN) {
                        this.#rankingPoints += 2;
                        this.#wins++;
                    } else if (match.result == Match.Result.TIE) {
                        this.#rankingPoints += 1;
                        this.#ties++;
                    } else {
                        this.#losses++;
                    }
                    if (match.red.rocketComplete) this.#rankingPoints += 1;
                    if (match.red.docked) this.#rankingPoints += 1;
                    this.#autoPoints += match.red.autoPoints;
                    this.#endgamePoints += match.red.endgamePoints;
                    this.#hatchPoints += match.red.hatchPoints;
                    this.#cargoPoints += match.red.cargoPoints;
                } else if (match.blue.teamNumbers.includes(this.number)) {
                    if (match.result == Match.Result.BLUE_WIN) {
                        this.#rankingPoints += 2;
                        this.#wins++;
                    } else if (match.result == Match.Result.TIE) {
                        this.#rankingPoints += 1;
                        this.#ties++;
                    } else {
                        this.#losses++;
                    }
                    if (match.blue.rocketComplete) this.#rankingPoints += 1;
                    if (match.blue.docked) this.#rankingPoints += 1;
                    this.#autoPoints += match.blue.autoPoints;
                    this.#endgamePoints += match.blue.endgamePoints;
                    this.#hatchPoints += match.red.hatchPoints;
                    this.#cargoPoints += match.red.cargoPoints;
                }
            }
        });
        this.#matchesPlayed = matches.length;
    }

    get rankingScore() {
        return this.#rankingPoints / this.#matchesPlayed;
    }

    get rankingPoints() {
        return this.#rankingPoints;
    }

    get autoPoints() {
        return this.#autoPoints;
    }

    get endgamePoints() {
        return this.#endgamePoints;
    }

    get hatchPoints() {
        return this.#hatchPoints;
    }

    get cargoPoints() {
        return this.#cargoPoints;
    }

    get wins() {
        return this.#wins;
    }

    get ties() {
        return this.#ties;
    }

    get losses() {
        return this.#losses;
    }

    get disqualifications() {
        return this.#disqualifications;
    }

    get matchesPlayed() {
        return this.#matchesPlayed;
    }
}
