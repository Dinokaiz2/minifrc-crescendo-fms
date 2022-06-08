const { ipcRenderer, contextBridge } = require("electron");
const Database = require('somewhere');
const path = require('path');
const { SerialPort } = require("serialport");
let db;
try {
    db = new Database(path.join(__dirname, './database.json'))
} catch (err) {
    console.log("Failed to load database.", err)
}
let port = new SerialPort({ path: "COM4", autoOpen: false, baudRate: 115200 }, (err) => { if (err) console.log("Open failed: ", err) });


// Expose API for persisting match and team data
// Example for doing this by reading and writing to a file
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

contextBridge.exposeInMainWorld(
    "serialport",
    {
        isOpen: () => port.isOpen,
        open: () => port.open(),
        read: () => port.read(),
        write: data => port.write(data)
    }
);

contextBridge.exposeInMainWorld("ipc", {
    on: (channel, listener) => ipcRenderer.on(channel, listener),
    send: (channel, ...args) => ipcRenderer.send(channel, ...args)
});

port.on("error", () => {}); // We check port.isOpen, only need an error stream for debugging

window.onload = () => {
    
    
    // var match = {
    //     Number: 2,
    //     Set: 0
    // }
    // db.save('matches', match);
    // var match = {
    //     Number: 3,
    //     Set: 0
    // }
    // db.save('matches', match);
    // console.log("preload db", db)
    // let match = db.findOne('matches', { Number: 1, Set: 0 });
    // db.update('matches', match.id, {MatchPointsRed: 13})

    // match = db.findOne('matches', { Number: 2, Set: 0 });
    // db.update('matches', match.id, {MatchPointsRed: 46})
    // console.log("Work", db)
    // contextBridge.exposeInMainWorld("jquery", { $: require("jquery") });
};