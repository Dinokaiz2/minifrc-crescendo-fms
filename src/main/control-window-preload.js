const { ipcRenderer, contextBridge } = require("electron");
const messages = require("./messages.js");

contextBridge.exposeInMainWorld("ipc", {
    on: (channel, listener) => ipcRenderer.on(channel, listener),
    send: (channel, ...args) => ipcRenderer.send(channel, ...args),
    CtrlMsg: messages.CtrlMsg,
    RenderMsg: messages.RenderMsg,
});