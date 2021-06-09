const { contextBridge } = require("electron");
const fs = require("fs");
var Database = require('somewhere');
const path = require('path');
var db = new Database(path.join(__dirname, './database.json'))


// Expose API for persisting match and team data
// Example for doing this by reading and writing to a file
contextBridge.exposeInMainWorld(
    "db",
    {
        readMatches: () => fs.readFileSync("match-data.txt"),
        writeMatches: (data) => fs.writeFileSync("match-data.txt", data),
        appendMatches: (data) => fs.appendFileSync("match-data.txt", data),
        readTeams: () => fs.readFileSync("team-data.txt"),
        writeTeams: (data) => fs.writeFileSync("team-data.txt", data),
        appendTeams: (data) => fs.appendFileSync("team-data.txt", data),
        createLocation: () => path.join(__dirname, './database.json'),
        database: (data) => new database(data),
        save: (match) => db.save('matches', match),
        findOne: (match) => db.findOne('matches', match),
        findAll: () => db.find('matches'),
        update: (id, change) => db.update('matches', id, change)

    }
);

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