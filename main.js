const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require('path');

app.allowRendererProcessReuse = false; // Deprecated, but required by Node Serialport

function createWindows() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        title: "MiniFRC Infinite Recharge FMS",
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

    ipcMain.on("view-match", () => mainWindow.webContents.send("view-match"));
    ipcMain.on("view-results", () => mainWindow.webContents.send("view-results"));
    ipcMain.on("view-rankings", () => mainWindow.webContents.send("view-rankings"));

    ipcMain.on("no-entry", () => mainWindow.webContents.send("no-entry"));
    ipcMain.on("safe-to-enter", () => mainWindow.webContents.send("safe-to-enter"));
    ipcMain.on("ready-for-match", () => mainWindow.webContents.send("ready-for-match"));
    ipcMain.on("start-match", () => mainWindow.webContents.send("start-match"));

    ipcMain.on("field-fault", () => mainWindow.webContents.send("field-fault"));
    ipcMain.on("replay-match", () => mainWindow.webContents.send("replay-match"));
    ipcMain.on("save-results", () => mainWindow.webContents.send("save-results"));
    ipcMain.on("next-match", () => mainWindow.webContents.send("next-match"));
    ipcMain.on("previous-match", () => mainWindow.webContents.send("previous-match"));

    ipcMain.on("add-red-initiation-line", () => mainWindow.webContents.send("add-red-initiation-line"));
    ipcMain.on("remove-red-initiation-line", () => mainWindow.webContents.send("remove-red-initiation-line"));
    ipcMain.on("add-blue-initiation-line", () => mainWindow.webContents.send("add-blue-initiation-line"));
    ipcMain.on("remove-blue-initiation-line", () => mainWindow.webContents.send("remove-blue-initiation-line"));

    ipcMain.on("add-red-hang", () => mainWindow.webContents.send("add-red-hang"));
    ipcMain.on("remove-red-hang", () => mainWindow.webContents.send("remove-red-hang"));
    ipcMain.on("add-blue-hang", () => mainWindow.webContents.send("add-blue-hang"));
    ipcMain.on("remove-blue-hang", () => mainWindow.webContents.send("remove-blue-hang"));

    ipcMain.on("add-red-park", () => mainWindow.webContents.send("add-red-park"));
    ipcMain.on("remove-red-park", () => mainWindow.webContents.send("remove-red-park"));
    ipcMain.on("add-blue-park", () => mainWindow.webContents.send("add-blue-park"));
    ipcMain.on("remove-blue-park", () => mainWindow.webContents.send("remove-blue-park"));

    ipcMain.on("set-red-level", () => mainWindow.webContents.send("set-red-level"));
    ipcMain.on("unset-red-level", () => mainWindow.webContents.send("unset-red-level"));
    ipcMain.on("set-blue-level", () => mainWindow.webContents.send("set-blue-level"));
    ipcMain.on("unset-blue-level", () => mainWindow.webContents.send("unset-blue-level"));

    ipcMain.on("add-red-foul", () => mainWindow.webContents.send("add-red-foul"));
    ipcMain.on("remove-red-foul", () => mainWindow.webContents.send("remove-red-foul"));
    ipcMain.on("add-blue-foul", () => mainWindow.webContents.send("add-blue-foul"));
    ipcMain.on("remove-blue-foul", () => mainWindow.webContents.send("remove-blue-foul"));

    ipcMain.on("add-red-tech-foul", () => mainWindow.webContents.send("add-red-tech-foul"));
    ipcMain.on("remove-red-tech-foul", () => mainWindow.webContents.send("remove-red-tech-foul"));
    ipcMain.on("add-blue-tech-foul", () => mainWindow.webContents.send("add-blue-tech-foul"));
    ipcMain.on("remove-blue-tech-foul", () => mainWindow.webContents.send("remove-blue-tech-foul"));


    ipcMain.on("loaded-undetermined-match", () => controlWindow.webContents.send("loaded-undetermined-match"));
    ipcMain.on("loaded-determined-match", () => controlWindow.webContents.send("loaded-determined-match"));
    ipcMain.on("match-ended", () => controlWindow.webContents.send("match-ended"));
    ipcMain.on("match-data", (event, ...data) => controlWindow.webContents.send("match-data", ...data));
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
                accelerator: "Ctrl+Shift+I",
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools()
                }
            },
            {
                label: "Reload",
                role: "reload",
                accelerator: "Ctrl+R",

            },
            {
                label: "Quit",
                click() {
                    app.quit()
                }
            }
        ]
    }
];
