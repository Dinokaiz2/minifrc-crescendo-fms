const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");
// import { CtrlMsg, RenderMsg } from "./messages.js";
const { CtrlMsg, RenderMsg } = require("./messages.js");

app.allowRendererProcessReuse = false; // Deprecated, but required by Node Serialport

function createWindows() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        title: "MiniFRC Deep Space FMS v2",
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    });
    mainWindow.loadFile("index.html");
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
    controlWindow.loadFile("control-window.html");
    
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
                // accelerator: "Ctrl+Shift+I",
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools()
                }
            },
            // {
            //     label: "Reload",
            //     role: "reload",
            //     accelerator: "Ctrl+R",
            // },
            {
                label: "Quit",
                click() {
                    app.quit()
                }
            }
        ]
    }
];
