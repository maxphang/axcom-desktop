const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    sendAsyncMessage: (message) => {
        ipcRenderer.send('asynchronous-message', message);
    },
    onAsyncReply: (callback) => {
        if (typeof callback !== 'function') {
            return () => {};
        }

        const subscription = (_event, ...args) => callback(...args);
        ipcRenderer.on('asynchronous-reply', subscription);
        return () => ipcRenderer.removeListener('asynchronous-reply', subscription);
    }
});
