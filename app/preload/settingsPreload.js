const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    readConfiguration: () => ipcRenderer.invoke('settings:readConfiguration'),
    saveConfiguration: (url) => ipcRenderer.invoke('settings:saveConfiguration', url),
    getSystemVersion: () => ipcRenderer.invoke('settings:getSystemVersion')
});
