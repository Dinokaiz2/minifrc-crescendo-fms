// TODO: need node serialport
// Read from FMS electronics: Auto/teleop high/low goals, phase activation state, color wheel info
// note: number received is number of GOALS, not number of POINTS. the translation from goals to points happens in controller.js
// ^ maybe the translation should happen in Match?
// TODO: what happens while we're not connected to the electronics?

import { Competition } from "./controller.js"
import { Match } from "./match.js"

let port = window.serialport;

/**
 * Static class to read and hold the state being sent by the FMS firmware.
 */
export class FmsFirmware {

    

    constructor() {
        this.#red = new this.Alliance(Match.AllianceColor.Red, this);
        this.#blue = new this.Alliance(Match.AllianceColor.Blue, this);
    }

    static get red() {
        return this.#red;
    }

    static get blue() {
        return this.#blue;
    }

    /**
     * Updates the field state based on data from the FMS firmware.
     * 
     * @param {Competition.FieldPhase} fieldPhase 
     */
    static update(fieldPhase) {
        if (port.isOpen()) {
            port.write(fieldPhase.toString());
            let byteArray = port.read()
            if (byteArray != null) {
                let str = new TextDecoder().decode(byteArray);
                let regex = /#([1-6]),([0-9]+),([0-9]+),([0-9]+),([0-9]+),([0-9]+),([0-3]),([1-6]),([0-9]+),([0-9]+),([0-9]+),([0-9]+),([0-9]+),([0-3])\$/
                let data = regex.exec(str)
                if (data != null && data.length == 15) {
                    this.#red.update(data.slice(1, 8));
                    this.#blue.update(data.slice(8, 15));
                }
            }
        } else {
            port.open();
        }
    }
    
    static get connected() {
        return port.isOpen()
    }

    /**
     * Private class to hold data per alliance for Field.
     */
    static Alliance = class Alliance {

        #data;

        #DataMap = {
            STAGE: 0,
            CAPACITY: 1,
            UPPER_AUTO: 2,
            BOTTOM_AUTO: 3,
            UPPER_TELEOP: 4,
            BOTTOM_TELEOP: 5,
            POSITIONAL_CONTROL_COLOR: 6
        };

        #Stage = {
            PHASE_1_CAPACITY: 1,
            PHASE_2_CAPACITY: 2,
            PHASE_2_ROTATIONAL_CONTROL: 3,
            PHASE_3_CAPACITY: 4,
            PHASE_3_POSITIONAL_CONTROL: 5,
            PHASE_3_ACTIVATED: 6
        };

        #Color = {
            NO_COLOR: 0,
            RED: 1,
            GREEN: 2,
            BLUE: 3
        };

        constructor() {
            this.#data = [0, 0, 0, 0, 0, 0, 0];
        }

        get autoUpperPort() {
            return this.#data[this.#DataMap.UPPER_AUTO];
        }
        
        get autoBottomPort() {
            return this.#data[this.#DataMap.BOTTOM_AUTO];
        }
        
        get teleopUpperPort() {
            return this.#data[this.#DataMap.UPPER_TELEOP];
        }
        
        get teleopBottomPort() {
            return this.#data[this.#DataMap.BOTTOM_TELEOP]
        }
        
        /**
         * The current activated phase.
         * @type {Match.Phase}
         */
        get activatedPhase() {
            if (this.#data[this.#DataMap.STAGE] == this.#Stage.PHASE_1_CAPACITY) return Match.Phase.NONE;
            if (this.#data[this.#DataMap.STAGE] == this.#Stage.PHASE_2_CAPACITY
                || this.#data[this.#DataMap.STAGE] == this.#Stage.PHASE_2_ROTATIONAL_CONTROL) return Match.Phase.PHASE_1;
            if (this.#data[this.#DataMap.STAGE] == this.#Stage.PHASE_3_CAPACITY
                || this.#data[this.#DataMap.STAGE] == this.#Stage.PHASE_3_POSITIONAL_CONTROL) return Match.Phase.PHASE_2;
            if (this.#data[this.#DataMap.STAGE] == this.#Stage.PHASE_3_ACTIVATED) return Match.Phase.PHASE_3;
        }
        
        /**
         * The number of power cells that have been scored during this phase.
         * @type {number}
         */
        get powerCellsInPhase() {
            return this.#data[this.#DataMap.CAPACITY]
        }
        
        /**
         * The color target for positional control.
         * @type {Match.ControlPanel}
         */
        get controlPanelTarget() {
            if (this.#data[this.#DataMap.POSITIONAL_CONTROL_COLOR] == this.#Color.NO_COLOR) return Match.ControlPanel.NO_COLOR;
            if (this.#data[this.#DataMap.POSITIONAL_CONTROL_COLOR] == this.#Color.RED) return Match.ControlPanel.RED;
            if (this.#data[this.#DataMap.POSITIONAL_CONTROL_COLOR] == this.#Color.GREEN) return Match.ControlPanel.GREEN;
            if (this.#data[this.#DataMap.POSITIONAL_CONTROL_COLOR] == this.#Color.BLUE) return Match.ControlPanel.BLUE;
        }

        update(data) {
            this.#data = data;
            this.#data.forEach((e, i, a) => a[i] = parseInt(a[i]));
        }
    }

    static #red = new FmsFirmware.Alliance();
    static #blue = new FmsFirmware.Alliance();
}
