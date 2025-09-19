const electron = require('electron')
const {app, BrowserWindow, ipcMain, globalShortcut, dialog } = electron; 
    // Module to control application life.
// const app = electron.app
    // Module to create native browser window.
// const BrowserWindow = electron.BrowserWindow
// const express = require("express");
const path = require('path')
const url = require('url')
var fs = require('fs');

// const Alert = require("electron-alert");

// const configFolder = 'config';
// const configName = 'config.json';
// const configFileName = configFolder + "/" + configName;
const configFileName = 'config.json';
const defaultConfigContent = '{"defaultLoadUrl":"https://sctrading.storemyway.com/web/admin/","loadUrl":"https://sctrading.storemyway.com/web/admin/"}';

// const escpos = require('escpos');
// install escpos-usb adapter module manually
// escpos.USB = require('escpos-usb');
// escpos.Network = require('escpos-network');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// function tryPosPrinter(){
//     const {PosPrinter} = require("electron-pos-printer");
//     // const path = require("path");
    
    

//     const options = {
//     preview: true,               // Preview in window or print
//     width: '170px',               //  width of content body
//     margin: '0 0 0 0',            // margin of content body
//     copies: 1,                    // Number of copies to print
//     printerName: 'Brother_MFC_J2330DW',//'XP-80C',        // printerName: string, check with webContent.getPrinters()
//     timeOutPerLine: 400,
//     pageSize: { height: 301000, width: 71000 },  // page size
//     timeOutPerLine: 5000,  // THIS
//     silent: true
//     }
    
//     const data = [
//     {
//         type: 'image',                                       
//         path: path.join(__dirname, 'assets/banner.png'),     // file path
//         position: 'center',                                  // position of image: 'left' | 'center' | 'right'
//         width: '60px',                                           // width of image in px; default: auto
//         height: '60px',                                          // width of image in px; default: 50 or '50px'
//     },{
//         type: 'text',                                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
//         value: 'SAMPLE HEADING',
//         style: `text-align:center;`,
//         css: {"font-weight": "700", "font-size": "18px"}
//     },{
//         type: 'text',                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
//         value: 'Secondary text',
//         style: `text-align:left;color: red;`,
//         css: {"text-decoration": "underline", "font-size": "10px"}
//     },{
//         type: 'barCode',
//         value: 'HB4587896',
//         height: 12,                     // height of barcode, applicable only to bar and QR codes
//         width: 1,                       // width of barcode, applicable only to bar and QR codes
//         displayValue: true,             // Display value below barcode
//         fontsize: 8,
//     },{
//         type: 'qrCode',
//         value: 'https://github.com/Hubertformin/electron-pos-printer',
//         height: 55,
//         width: 55,
//         style: 'margin: 10 20px 20 20px'
//         },{
//         type: 'table',
//         // style the table
//         style: 'border: 1px solid #ddd',
//         // list of the columns to be rendered in the table header
//         tableHeader: ['Animal', 'Age'],
//         // multi dimensional array depicting the rows and columns of the table body
//         tableBody: [
//             ['Cat', 2],
//             ['Dog', 4],
//             ['Horse', 12],
//             ['Pig', 4],
//         ],
//         // list of columns to be rendered in the table footer
//         tableFooter: ['Animal', 'Age'],
//         // custom style for the table header
//         tableHeaderStyle: 'background-color: #000; color: white;',
//         // custom style for the table body
//         tableBodyStyle: 'border: 0.5px solid #ddd',
//         // custom style for the table footer
//         tableFooterStyle: 'background-color: #000; color: white;',
//         },{
//         type: 'table',
//         style: 'border: 1px solid #ddd',             // style the table
//         // list of the columns to be rendered in the table header
//         tableHeader: [{type: 'text', value: 'Animal'}, {type: 'image', path: path.join(__dirname, 'icons/animal.png')}],
//         // multi dimensional array depicting the rows and columns of the table body
//         tableBody: [
//             [{type: 'text', value: 'Cat'}, {type: 'image', path: './animals/cat.jpg'}],
//             [{type: 'text', value: 'Dog'}, {type: 'image', path: './animals/dog.jpg'}],
//             [{type: 'text', value: 'Horse'}, {type: 'image', path: './animals/horse.jpg'}],
//             [{type: 'text', value: 'Pig'}, {type: 'image', path: './animals/pig.jpg'}],
//         ],
//         // list of columns to be rendered in the table footer
//         tableFooter: [{type: 'text', value: 'Animal'}, 'Image'],
//         // custom style for the table header
//         tableHeaderStyle: 'background-color: #000; color: white;',
//         // custom style for the table body
//         tableBodyStyle: 'border: 0.5px solid #ddd',
//         // custom style for the table footer
//         tableFooterStyle: 'background-color: #000; color: white;',
//         },
//     ]
    
//     PosPrinter.print(data, options)
//     .then(() => {})
//     .catch((error) => {
//         console.error('pos printer error occurred.', error);
//     });
    
// }

// async function testThermalPrinter(){

//     const ThermalPrinter = require("node-thermal-printer").printer;
//     const PrinterTypes = require("node-thermal-printer").types;

//     console.log('printers', PrinterTypes)

//     let printer = new ThermalPrinter({
//     type: PrinterTypes.STAR,                                  // Printer type: 'star' or 'epson'
//     interface: 'printer:Brother_MFC_J2330DW',//'tcp://xxx.xxx.xxx.xxx',                       // Printer interface
//     characterSet: 'SLOVENIA',                                 // Printer character set - default: SLOVENIA
//     removeSpecialCharacters: false,                           // Removes special characters - default: false
//     driver: require(electron ? 'electron-printer' : 'printer'),
//     lineCharacter: "=",                                       // Set character for lines - default: "-"
//     options:{                                                 // Additional options
//         timeout: 5000                                           // Connection timeout (ms) [applicable only for network printers] - default: 3000
//     }
//     });

//     let isConnected = await printer.isPrinterConnected();       // Check if printer is connected, return bool of status
//     let execute = await printer.execute();                      // Executes all the commands. Returns success or throws error
//     let raw = await printer.raw(Buffer.from("Hello world")); 

//     console.log('isconnected', isConnected);

//     // printer.print("Hello World");                               // Append text
//     // printer.println("Hello World");                             // Append text with new line
//     // printer.openCashDrawer();                                   // Kick the cash drawer
//     // printer.cut();                                              // Cuts the paper (if printer only supports one mode use this)
//     // printer.partialCut();                                       // Cuts the paper leaving a small bridge in middle (if printer supports multiple cut modes)
//     // printer.beep();                                             // Sound internal beeper/buzzer (if available)
//     // printer.upsideDown(true);                                   // Content is printed upside down (rotated 180 degrees)
//     // printer.setCharacterSet("SLOVENIA");                        // Set character set - default set on init
//     // printer.setPrinterDriver(Object)  
// }

// async function useescpos_network(printer, products) {
//   console.log('printing - escpos.Network:', printer);

//   return new Promise((resolve, reject) => {
//     const debugDevice = new escpos.Network(printer, 80);
//     debugDevice.open((err) => {
//       if (err) return reject(err);
//       return resolve(debugDevice);
//     });
//   }).then((device) => {
      
//     const debugPrinter = new escpos.Printer(device);

//     console.log('debugPrinter', debugPrinter);

//     debugPrinter
//       .font('A')
//       .align('LT')
//       .style('BU')
//       .size(1, 1)
//       .text(`Printer: ${printer}`)
//       .text(`Product: ${products}`);
//     // products.forEach(product => debugPrinter.text(`${product.name}`));

//     debugPrinter
//       .text(' ')
//       .text(' ')
//       .cut()
//       .close();
//   });
// }

// function useescpos_usb(){
    
//     console.log('printer usb', escpos.USB.findPrinter());
//     // console.log('printer usb', escpos.Network.findPrinter());

//     // Select the adapter based on your printer type
//     const device  = new escpos.USB();
//     // const device  = new escpos.Network('192.168.50.226');
//     // const device = new 
//     // const device  = new escpos.Serial('/dev/usb/lp0');

//     const options = { encoding: "GB18030" /* default */ }
//     // encoding is optional

//     const printer = new escpos.Printer(device, options);

//     device.open(function (error) {

//         if (error) {
//             console.error(error);
//             return;
//         }

//         printer
//         .font('a')
//         .align('ct')
//         .style('bu')
//         .size(1, 1)
//         .text("I love Malaysia")
//         .cut()
//         .close();
        
//     });

//     // device.open(function(error){
//     //     printer
//     //     .font('a')
//     //     .align('ct')
//     //     .style('bu')
//     //     .size(1, 1)
//     //     .text('The quick brown fox jumps over the lazy dog')
//     //     .text('敏捷的棕色狐狸跳过懒狗')
//     //     .barcode('1234567', 'EAN8')
//     //     .table(["One", "Two", "Three"])
//     //     .tableCustom(
//     //         [
//     //         { text:"Left", align:"LEFT", width:0.33, style: 'B' },
//     //         { text:"Center", align:"CENTER", width:0.33},
//     //         { text:"Right", align:"RIGHT", width:0.33 }
//     //         ],
//     //         { encoding: 'cp857', size: [1, 1] } // Optional
//     //     )
//     //     .qrimage('https://github.com/song940/node-escpos', function(err){
//     //         this.cut();
//     //         this.close();
//     //     });

//         // printer
//         // .getStatus(statuses.PrinterStatus.getClassName(), status => {
//         //     console.log(status.toJSON());
//         // })
//         // .close();

//     // const device = new escpos.SerialPort('COM3');
//     // const printer = new escpos.Printer(device);

//     // device.open(function (error) {
//     //     if (error) {
//     //         console.error(error);
//     //         return;
//     //     }
//     //     printer
//     //         .getStatuses(statuses => {
//     //             statuses.forEach(status => {
//     //                 console.log(status.toJSON());
//     //             })
//     //         })
//     //         .close();
//     // });
// }

// function useNodePrinter(){

//         var printer = require('printer');
//         util = require('util');
//         console.log("installed printers:\n"+util.inspect(printer.getPrinters(), {colors:true, depth:10}));

//         console.log('default printer name: ' + (printer.getDefaultPrinterName() || 'is not defined on your computer'));

//         console.log("supported formats are:\n"+util.inspect(printer.getSupportedPrintFormats(), {colors:true, depth:10}));
        
//         console.log("supported job commands:\n"+util.inspect(printer.getSupportedJobCommands(), {colors:true, depth:10}));
        
//          var fs = require('fs');
//          filename = 'sample.txt';

//     readData = fs.readFileSync(filename);
//     console.log('read data', readData);

//         printer.printDirect({
//             // data:"print from Node.JS buffer sdfdsfdsfdsfd" // or simple String: "some text"
//             data: readData
//             , printer: printer.getDefaultPrinterName()//'Foxit Reader PDF Printer' // printer name, if missing then will print to default printer
//             , type: 'RAW' // type: RAW, TEXT, PDF, JPEG, .. depends on platform
//             , success:function(jobID){
//                console.log("Job sent with ID: " + jobID) 
//                 var jobInfo = printer.getJob(printer.getDefaultPrinterName(), jobID)
//                 console.log("Job info:" + JSON.stringify(jobInfo, null, 2))

//                 // printer.setJob(printer.getDefaultPrinterName(), jobID, 'RESTART')

//             }
//             , error:function(err){console.log(err);}
//         });
        
// }

function readConfig(){

    // let appPath =  path.parse(app.getPath('userData'));
    let appConfigPath = configFileName;
    //appPath?.dir + '\\' + configFolder + '\\' + configName;

    // promptDialog(
    //     true,
    //     mainWindow,
    //     {
    //         message: "read from " + appConfigPath
    //     }
    // )

    
    let data = fs.readFileSync(appConfigPath, 'utf8');
    // function (err,data) {
    //     if (err) {
    //     return console.log(err);
    //     }
    //     console.log(data);
    //     return data;
    // });

    // console.log('data', data)

    // promptDialog(
    //     true,
    //     mainWindow,
    //     {
    //         message: "data read from " + JSON.stringify(data)
    //     }
    // )

    return JSON.parse(data);
}

function getNewConfigJson(url){
    let currentConfig = readConfig(configFileName);
    return {
        defaultLoadUrl: currentConfig?.defaultLoadUrl,
        loadUrl: url
    }
}

function initConfig(){

    // With checking if dir already exists
    // if (!fs.existsSync(configFolder)) 
    //     fs.mkdir(configFolder, (err) => {
    //         if (err) {
    //             return console.error(err);
    //         }
    //         console.log(configFolder + ': Directory created successfully!');

    //     }
    // );

    // let configFileName = 'config.json';
    
    if (!fs.existsSync(configFileName)){
       
        fs.writeFile(configFileName, defaultConfigContent, (err) => {
            if(err)
                console.log(err)
        })

        promptQuick('init config file saved.')

    }else{
        
        promptQuick('existing config detected.')
        
    };
    

    return defaultConfigContent;
}


function saveNewConfigJson(url){

    // let configFileName = 'config.json';

    let newJson = getNewConfigJson(url);

    promptQuick('configFileName' + configFileName)

    fs.writeFile(configFileName, JSON.stringify(newJson), (err) => {
        if(err)
            console.log(err)
    })

    promptQuick('new config file saved.' + JSON.stringify(newJson))

    promptDialog(
            true,
            mainWindow,
            {
                title: "Saved Changes",
                message: "Config saved ! Restart application to take effects !"
            }
        )

    return newJson;
}


function promptQuick(msg, obj = {}){
    // dialog.showErrorBox(
    //     "quick prompt",
    //     '-->' + msg + obj.length? JSON.stringify(obj) : ''
    // )
}

function promptDialog(_status, _win, _props){

    let defaultProps = {};

    if(_status === true){
        defaultProps.type = 'none';
        defaultProps.title = 'Success !';
    }else if(_status === false){
        defaultProps.type = 'error'
        defaultProps.title = 'Error Occurred !';
    }

    if(!_props?.message){
        _props.message = '--';
    }

    dialog.showMessageBox(
        _win, 
        {
            ...defaultProps,
            ..._props
        }
    );
}

function createWindowApplication() {

    //load config files
    let config = readConfig();

    let loadUrl = config?.loadUrl;

    if(!loadUrl){
        
        promptDialog(
            false,
            mainWindow,
            {
                message: "Invalid loadUrl"
            }
        )

        return false;
    }
    console.log('Opening Main : ' + loadUrl)

    const screenElectron = electron.screen;
    const display = screenElectron.getPrimaryDisplay();
    const dimensions = display.workAreaSize;

    const _ratio = {width: 0.95, height: 0.95}
    let width = parseInt(dimensions.width * _ratio.width);
    let height = parseInt(dimensions.height * _ratio.height);

    // console.log(width, height)

    const maxWidth = 1200;
    const maxHeight = 850;

    width = width > maxWidth? maxWidth : width;
    height = height > maxHeight? maxHeight : height;
    
    minWidth = width > maxWidth? maxWidth : width;
    minHeight = height > maxHeight? maxHeight : height;

    // console.log(width, height)

    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: width,
        height: height,
        minWidth: minWidth,
        minHeight: minHeight,
        maxWidth: dimensions.width,
        maxHeight: dimensions.height,
        // icon: `${__dirname}/assets/icon.ico`
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // workaround to allow use with Electron 12+
            // preload: path.join(__dirname, 'preload.js'),
            enableRemoteModule: true
        }
    })

    mainWindow.loadURL(
        loadUrl
        // 'http://axstoremyway.axcom.my/web/admin/',
        // 'http://axsctrading.axcom.my/web/admin/',
        // 'http://localhost:8899/axsmw/web/admin'
        // 'http://localhost/xampp/axsmw/web/admin'
    )

    // testThermalPrinter();

    // useescpos_usb();
    // useescpos_network();

    // useNodePrinter();

        // var printer = require('printer');
        // util = require('util');
        // console.log("installed printers:\n"+util.inspect(printer.getPrinters(), {colors:true, depth:10}));

        // console.log('default printer name: ' + (printer.getDefaultPrinterName() || 'is not defined on your computer'));

        // console.log("supported formats are:\n"+util.inspect(printer.getSupportedPrintFormats(), {colors:true, depth:10}));
        
        // console.log("supported job commands:\n"+util.inspect(printer.getSupportedJobCommands(), {colors:true, depth:10}));
        
        // printer.printDirect({
        //     data:"print from Node.JS buffer sdfdsfdsfdsfd" // or simple String: "some text"
        //     , printer: 'Brother MFC-J2330DW Printer'//'Foxit Reader PDF Printer' // printer name, if missing then will print to default printer
        //     , type: 'RAW' // type: RAW, TEXT, PDF, JPEG, .. depends on platform
        //     , success:function(jobID){
        //         console.log("sent to printer with ID: "+jobID);
        //     }
        //     , error:function(err){console.log(err);}
        // });

    // console.log('printer list', mainWindow.webContents.getPrinters());

    // and load the index.html of the app.
    // mainWindow.loadURL(url.format({
    //     pathname: path.join(__dirname, 'index.html'),
    //     protocol: 'file:',
    //     slashes: true
    // }))

        // tryPosPrinter();

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()


    // let getDevices = require('usb-barcode-scanner').getDevices;
    // let allDevices = getDevices();

    // console.log(getDevices());

    // console.log('aaaaa');

    // let UsbScanner = require('usb-barcode-scanner').UsbScanner;
    
    // let device = allDevices.filter((item) => {
    //     return item.product == 'Apple Internal Keyboard / Trackpad'? true:false;
    // })

    // console.log('selected', device);

    // console.log(device[0].vendorId);
    // console.log(device[0].productId);
    // console.log(device[0].path);

    // let scanner = new UsbScanner({
    //     vendorId: device[0].vendorId,
    //     productId: device[0].productId,
    //     path: device[0].path
    // });

    // scanner.on('data', (data) => {
    //     console.log('raw data from usb', data);
    // });
    
    // scanner.startScanning();

    // var HID = require('node-hid');
    // var allDevices = HID.devices();

    // console.log('all devices', allDevices);

    // let filteredDevices = allDevices.filter((item) => {
    //     return item.product == 'Barcode Reader '? true:false;
    // })

    // console.log('selected devices', filteredDevices)

    // // var barcodeScanner = new HID.HID(filteredDevices[0].path);
    // var barcodeScanner = new HID.HID(filteredDevices[0].vendorId,filteredDevices[0].productId);

    // barcodeScanner.on("data", function(data) { console.log('reading', data)});

    // barcodeScanner.on("error", function(error) { console.log('error', error)});

    // Emitted when the window is closed.
    // mainWindow.on('closed', function() {
    //     // Dereference the window object, usually you would store windows
    //     // in an array if your app supports multi windows, this is the time
    //     // when you should delete the corresponding element.
    //     mainWindow = null
    // })

    ipcMain.on('asynchronous-message', (event, args) => {
        console.log('receiving signal:', args)
        event.sender.send('asynchronous-reply', 'message received ');
    })

    // mainWindow.webContents.on('did-finish-load', () => {
    //     mainWindow.webContents.send('asynchronous-reply', 'auto send');
    // });

}


function createWindowSetting() {

    const screenElectron = electron.screen;
    const display = screenElectron.getPrimaryDisplay();
    const dimensions = display.workAreaSize;

    const _ratio = {width: 0.95, height: 0.95}
    let width = parseInt(dimensions.width * _ratio.width);
    let height = parseInt(dimensions.height * _ratio.height);

    // console.log(width, height)

    const maxWidth = 600;
    const maxHeight = 425;

    width = width > maxWidth? maxWidth : width;
    height = height > maxHeight? maxHeight : height;
    
    minWidth = width > maxWidth? maxWidth : width;
    minHeight = height > maxHeight? maxHeight : height;

    // console.log(width, height)

    // Create the browser window.
    mainWindowSetting = new BrowserWindow({
        width: width,
        height: height,
        minWidth: minWidth,
        minHeight: minHeight,
        maxWidth: dimensions.width,
        maxHeight: dimensions.height,
        // icon: `${__dirname}/assets/icon.ico`
        frame: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // workaround to allow use with Electron 12+
            // preload: path.join(__dirname, 'preload.js'),
            enableRemoteModule: true
        }
    })

    mainWindowSetting.loadURL('file://' + __dirname + '/config/setting.html');

    // Emitted when the window is closed.
    mainWindowSetting.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindowSetting = null;
    });

}

// This is required to be set to false beginning in Electron v9 otherwise
// the SerialPort module can not be loaded in Renderer processes like we are doing
// in this example. The linked Github issues says this will be deprecated starting in v10,
// however it appears to still be changed and working in v11.2.0
// Relevant discussion: https://github.com/electron/electron/issues/18397
app.allowRendererProcessReuse=false

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.on('ready', createWindowApplication)

// app.on('ready', () => {

    
//     const path = 'config';

//     // Without checking if dir already exists
//     // fs.mkdir(path);

//     console.log('path', path);

//     // With checking if dir already exists
//     if (!fs.existsSync(path)) 
//         fs.mkdir(path, (err) => {
//             if (err) {
//                 return console.error(err);
//             }
//             console.log('Directory created successfully!');
//         }
//     );

// })

app.whenReady().then(() => {

    let key;
    
    // key = 'Alt+CommandOrControl+A';
    key = 'Control+Alt+X';

    globalShortcut.register(key, () => {
        console.log('Opening Application Settings via '+key+' !');
        createWindowSetting();
    })

    key = 'Alt+X';

    globalShortcut.register(key, () => {
        console.log('Opening Application Settings via '+key+' !');
        createWindowSetting();
    })

    initConfig();

    console.log('read', readConfig());
    
}).then(createWindowApplication)

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    app.quit()
})

app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindowApplication()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
exports.saveConfiguration = (url) => {
    // console.log('Yay');
    return saveNewConfigJson(url);
}

exports.readConfiguration = () => {
    return readConfig();
}

exports.getSystemVersion = () => {
    let packageJson = require("../package.json");
    // console.log('aaa', packageJson)
    return packageJson.version;
}