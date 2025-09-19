// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const serialport = require('serialport')
const tableify = require('tableify')

// const Photon = require("electron-photon");

// Photon.__baseDir = "/myPhotonMaster";

// // Options are just custom options for electron BrowserWindow (https://electronjs.org/docs/api/browser-window)
// const options = {
//   width: 600,
//   height: 400,
//   minHeight: 150,
//   minWidth: 200
// };

// // Just use the element's query selector
// Photon.Dialog("#dialog1", options);
// // Or use the element instead
// Photon.Dialog(xTemplateScriptElement, options);

const Readline = require("@serialport/parser-readline");
// const SerialPort = require('serialport');

//define the serial port
// const port = new serialport("/dev/tty.usbserial-1420", {
//   baudRate: 9600
// })

// //serial port parse
// const parser = new Readline();
// port.pipe(parser);

// //read the data via parse
// parser.on("data", (line) => {
//   console.log(line);
// })

// //write data to the serial port
// port.write("ROBOT POWER ON");

const exists = portName => serialport.list().then(ports => ports.some(port => port.comName === portName ));

exists("CM7").then(res => console.log(res?"exists":"doesnt exist"));


async function listSerialPorts() {
  await serialport.list().then((ports, err) => {
    if(err) {
      document.getElementById('error').textContent = err.message
      return
    } else {
      document.getElementById('error').textContent = ''
    }
    console.log('ports', ports);

    if (ports.length === 0) {
      document.getElementById('error').textContent = 'No ports discovered'
    }

    tableHTML = tableify(ports)
    document.getElementById('ports').innerHTML = tableHTML
  })
}

// Set a timeout that will check for new serialPorts every 2 seconds.
// This timeout reschedules itself.
setTimeout(function listPorts() {
  listSerialPorts();
  setTimeout(listPorts, 2000);
}, 2000);