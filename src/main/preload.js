const { ipcRenderer, contextBridge } = require("electron");
const Database = require('somewhere');
const path = require('path');
const { CtrlMsg, RenderMsg } = require("./messages.js");
let db;
try {
    db = new Database(path.join(__dirname, '../../db/database.json'))
} catch (err) {
    console.log("Failed to load database.", err)
}

// Expose API for persisting match and team data
contextBridge.exposeInMainWorld(
    "db",
    {
        save: (match) => db.save('matches', match),
        findOne: (match) => db.findOne('matches', match),
        findAll: () => db.find('matches'),
        update: (id, change) => db.update('matches', id, change)
    }
);

contextBridge.exposeInMainWorld(
    "teamDb",
    {
        save: (team) => db.save('teams', team),
        findOne: (team) => db.findOne('teams', team),
        findAll: () => db.find('teams'),
        update: (id, change) => db.update('teams', id, change)
    }
)

contextBridge.exposeInMainWorld("ipc", {
    on: (channel, listener) => ipcRenderer.on(channel, listener),
    send: (channel, ...args) => ipcRenderer.send(channel, ...args),
    CtrlMsg: CtrlMsg,
    RenderMsg: RenderMsg
});