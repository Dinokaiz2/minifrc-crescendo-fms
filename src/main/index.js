const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");
const { CtrlMsg, RenderMsg } = require("./messages.js");

const debug = false;

app.allowRendererProcessReuse = false; // Deprecated, but required by Node Serialport

function createWindows() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        title: "MiniFRC Crescendo FMS",
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    });
    mainWindow.loadFile("src/static/index.html");
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);

    const controlWindow = new BrowserWindow({
        width: 800,
        height: 600,
        title: "FMS Control Window",
        webPreferences: {
            preload: path.join(__dirname, "control-window-preload.js")
        }
    });
    controlWindow.loadFile("src/static/control-window.html");
    
    Object.values(CtrlMsg).forEach(msg => ipcMain.on(msg, (event, data) => mainWindow.webContents.send(msg, data)));
    Object.values(RenderMsg).forEach(msg => ipcMain.on(msg, (event, data) => controlWindow.webContents.send(msg, data)));
    
}

app.whenReady().then(createWindows);

app.on("window-all-closed", app.quit);

const menuTemplate = [
    {
        label: "Menu",
        submenu: [
            {
                label: "Fullscreen",
                accelerator: "F11",
                click(item, focusedWindow) {
                    if (focusedWindow.isFullScreen()) {
                        focusedWindow.setFullScreen(false)
                        focusedWindow.setMenuBarVisibility(true)
                    } else {
                        focusedWindow.setFullScreen(true)
                        focusedWindow.setMenuBarVisibility(false)
                    }
                }
            },
            {
                label: "Toggle DevTools",
                click(item, focusedWindow) { focusedWindow.toggleDevTools() }
            },
            {
                label: "Reload",
                role: "reload",
                accelerator: ""
            },
            {
                label: "Quit",
                click() { app.quit() }
            }
        ]
    }
];

if (debug) {
    menuTemplate[0].submenu[1].accelerator = "Ctrl+Shift+I"; // Toggle DevTools
    menuTemplate[0].submenu[2].accelerator = "Ctrl+R"; // Reload
}
