// TODO: need node serialport
// Read from FMS electronics: Auto/teleop high/low goals, phase activation state, color wheel info
// note: number received is number of GOALS, not number of POINTS. the translation from goals to points happens in controller.js
// ^ maybe the translation should happen in Match?
// TODO: what happens while we're not connected to the electronics?

import { Competition } from "./controller.js"

/**
 * Static class to read and hold the state being sent by the FMS firmware.
 */
export class FmsFirmware {

    #red;
    #blue;

    constructor() {
        this.#red = new this.#Alliance();
        this.#blue = new this.#Alliance();
    }

    get red() {
        return this.#red;
    }

    get blue() {
        return this.#blue;
    }

    /**
     * Updates the field state based on data from the FMS firmware.
     * 
     * @param {Competition.FieldPhase} fieldPhase 
     */
    static update(fieldPhase) {
        // check for incoming packets
        // parse them out
        // update Alliances with state
        // send FieldPhase
    }
    

    /**
     * Private class to hold data per alliance for Field.
     */
    #Alliance = class Alliance {

        static getAutoUpperPort() {

        }
        
        static getAutoBottomPort() {
            
        }
        
        static getTeleopUpperPort() {
        
        }
        
        static getTeleopBottomPort() {
        
        }
        
        /**
         * Gets the current activated phase.
         * @return {number}
         */
        static getActivatedPhase() {
        
        }
        
        /**
         * Gets the number of power cells that have been scored during this phase.
         * @return {number}
         */
        static getPowerCellsInPhase() {
        
        }
        
        /**
         * Gets the color target for positional control, if available
         */
        static getControlPanelTarget() {
        
        }
    }
}
