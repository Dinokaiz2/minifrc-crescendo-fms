const { app, BrowserWindow, Menu } = require("electron");
const path = require('path');

app.allowRendererProcessReuse = false; // Deprecated, but required by Node Serialport

function createWindow() {
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
}

app.whenReady().then(createWindow);

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
