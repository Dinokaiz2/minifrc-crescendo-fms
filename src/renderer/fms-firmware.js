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

    static acceptingInput = true;

    static get connected() {
        return port.isOpen()
    }

    /**
     * Updates the field state based on data from the FMS firmware.
     * 
     * @param {Competition.FieldPhase} fieldPhase 
     */
    static update(fieldPhase) {
        if (port.isOpen()) {
            port.write(fieldPhase.toString());
            if (acceptingInput) {
                let byteArray = port.read()
                if (byteArray != null) {
                    let str = new TextDecoder().decode(byteArray);
                    let regex = /#([1-6]),([0-9]+),([0-9]+),([0-9]+),([0-9]+),([0-9]+),([0-3]),([1-6]),([0-9]+),([0-9]+),([0-9]+),([0-9]+),([0-9]+),([0-3])\$/
                    let data = regex.exec(str)
                    if (data != null && data.length == 15) this.#updateMatch(data);
                }
            }
        } else {
            port.open();
        }
    }

    static #updateMatch(data) {
        
        let DataMap = {
            STAGE: 0,
            CAPACITY: 1,
            UPPER_AUTO: 2,
            BOTTOM_AUTO: 3,
            UPPER_TELEOP: 4,
            BOTTOM_TELEOP: 5,
            POSITION_CONTROL_COLOR: 6
        };
    
        let Stage = {
            PHASE_1_CAPACITY: 1,
            PHASE_2_CAPACITY: 2,
            PHASE_2_ROTATION_CONTROL: 3,
            PHASE_3_CAPACITY: 4,
            PHASE_3_POSITION_CONTROL: 5,
            PHASE_3_ACTIVATED: 6
        };
    
        let Color = {
            NO_COLOR: 0,
            RED: 1,
            GREEN: 2,
            BLUE: 3
        };

        function updateAlliance(alliance, data) {
            if (data[DataMap.STAGE] == Stage.PHASE_1_CAPACITY) alliance.phase = Match.Phase.NONE;
            else if (data[DataMap.STAGE] == Stage.PHASE_2_CAPACITY
                || data[DataMap.STAGE] == Stage.PHASE_2_ROTATION_CONTROL) alliance.phase = Match.Phase.PHASE_1;
            else if (data[DataMap.STAGE] == Stage.PHASE_3_CAPACITY
                || data[DataMap.STAGE] == Stage.PHASE_3_POSITION_CONTROL) alliance.phase = Match.Phase.PHASE_2;
            else if (data[DataMap.STAGE] == Stage.PHASE_3_ACTIVATED) alliance.phase = Match.Phase.PHASE_3;
            alliance.powerCellsInPhase = parseInt(data[DataMap.CAPACITY]);
            alliance.autoBottomPort = parseInt(data[DataMap.BOTTOM_AUTO]);
            alliance.autoUpperPort = parseInt(data[DataMap.UPPER_AUTO]);
            alliance.teleopBottomPort = parseInt(data[DataMap.BOTTOM_TELEOP]);
            alliance.teleopUpperPort = parseInt(data[DataMap.UPPER_TELEOP]);
            if (data[DataMap.POSITION_CONTROL_COLOR] == Color.NO_COLOR) alliance.positionControlTarget = Match.ControlPanel.NO_COLOR;
            if (data[DataMap.POSITION_CONTROL_COLOR] == Color.RED) alliance.positionControlTarget = Match.ControlPanel.RED;
            if (data[DataMap.POSITION_CONTROL_COLOR] == Color.GREEN) alliance.positionControlTarget = Match.ControlPanel.GREEN;
            if (data[DataMap.POSITION_CONTROL_COLOR] == Color.BLUE) alliance.positionControlTarget = Match.ControlPanel.BLUE;
        }
        
        updateAlliance(Competition.match.red, data.slice(1, 8));
        updateAlliance(Competition.match.blue, data.slice(8, 15));
    }
}
