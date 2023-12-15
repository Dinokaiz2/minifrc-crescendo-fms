import { Competition } from "./controller.js"
import * as matchRenderer from "./match-renderer.js";
import * as resultsRenderer from "./results-renderer.js";
import * as rankingsRenderer from "./rankings-renderer.js";

let prevView = -1;
function update() {
    
    if (Competition.view == Competition.View.MATCH) {
        if (Competition.view != prevView) {
            prevView = Competition.view;
            matchRenderer.show();
            resultsRenderer.hide();
            rankingsRenderer.hide();
        }
        matchRenderer.update();
    } else if (Competition.view == Competition.View.RESULTS) {
        if (Competition.view != prevView) {
            prevView = Competition.view;
            matchRenderer.hide();
            resultsRenderer.show();
            rankingsRenderer.hide();
        }
        resultsRenderer.update();
    } else if (Competition.view == Competition.View.RANKINGS) {
        if (Competition.view != prevView) {
            prevView = Competition.view;
            matchRenderer.hide();
            resultsRenderer.hide();
            rankingsRenderer.show();
        }
        rankingsRenderer.update();
    }
}

// Refresh the display 50 times per second
// TODO: make sure this doesn't get called more than once
$(() => setInterval(update, 20));

matchRenderer.startVideo();
Competition.begin();