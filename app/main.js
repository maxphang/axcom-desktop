const { app, BrowserWindow, ipcMain, globalShortcut, dialog, screen } = require('electron');
const path = require('path');
const fs = require('fs');

// const Alert = require("electron-alert");

// const configFolder = 'config';
// const configName = 'config.json';
// const configFileName = configFolder + "/" + configName;
const CONFIG_FILE_NAME = 'config.json';
const DEFAULT_CONFIG = {
    defaultLoadUrl: 'https://sctrading.storemyway.com/web/admin/',
    loadUrl: 'https://sctrading.storemyway.com/web/admin/'
};

function getConfigPath() {
    return path.join(app.getPath('userData'), CONFIG_FILE_NAME);
}

function normalizeConfig(rawConfig = {}) {
    const defaultLoadUrl = typeof rawConfig.defaultLoadUrl === 'string' && rawConfig.defaultLoadUrl.trim()
        ? rawConfig.defaultLoadUrl.trim()
        : DEFAULT_CONFIG.defaultLoadUrl;

    const loadUrl = typeof rawConfig.loadUrl === 'string' && rawConfig.loadUrl.trim()
        ? rawConfig.loadUrl.trim()
        : DEFAULT_CONFIG.loadUrl;

    return {
        defaultLoadUrl,
        loadUrl
    };
}

function writeConfigFile(configPath, config) {
    fs.mkdirSync(path.dirname(configPath), { recursive: true });
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

function getLegacyConfigCandidates(targetPath) {
    const candidates = new Set([
        path.resolve(__dirname, '..', CONFIG_FILE_NAME),
        path.resolve(process.cwd(), CONFIG_FILE_NAME)
    ]);

    try {
        candidates.add(path.resolve(app.getAppPath(), CONFIG_FILE_NAME));
    } catch (error) {
        // Ignored: app path may not be available in some startup scenarios.
    }

    if (process.resourcesPath) {
        candidates.add(path.resolve(process.resourcesPath, CONFIG_FILE_NAME));
    }

    candidates.delete(targetPath);
    return Array.from(candidates);
}

function tryMigrateLegacyConfig(targetPath) {
    const candidates = getLegacyConfigCandidates(targetPath);

    for (const candidate of candidates) {
        if (!candidate || !fs.existsSync(candidate)) {
            continue;
        }

        try {
            const legacyContent = fs.readFileSync(candidate, 'utf8');
            const parsed = JSON.parse(legacyContent);
            const normalized = normalizeConfig(parsed);
            writeConfigFile(targetPath, normalized);
            promptQuick(`migrated configuration from ${candidate}`);
            return candidate;
        } catch (error) {
            console.warn(`Failed to migrate configuration from ${candidate}.`, error);
        }
    }

    return false;
}

function ensureConfigFile() {
    const targetPath = getConfigPath();

    if (fs.existsSync(targetPath)) {
        return { path: targetPath, created: false };
    }

    const migratedFrom = tryMigrateLegacyConfig(targetPath);
    if (migratedFrom) {
        return { path: targetPath, created: false, migratedFrom };
    }

    writeConfigFile(targetPath, { ...DEFAULT_CONFIG });
    promptQuick('init config file saved.');
    return { path: targetPath, created: true };
}

function loadConfigFromPath(configPath) {
    try {
        const data = fs.readFileSync(configPath, 'utf8');
        const parsed = JSON.parse(data);
        const normalized = normalizeConfig(parsed);

        if (parsed.defaultLoadUrl !== normalized.defaultLoadUrl || parsed.loadUrl !== normalized.loadUrl) {
            writeConfigFile(configPath, normalized);
        }

        return normalized;
    } catch (error) {
        console.error('Failed to parse configuration file. Falling back to defaults.', error);
        writeConfigFile(configPath, { ...DEFAULT_CONFIG });
        return { ...DEFAULT_CONFIG };
    }
}

// const escpos = require('escpos');
// install escpos-usb adapter module manually
// escpos.USB = require('escpos-usb');
// escpos.Network = require('escpos-network');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let mainWindowSetting;

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

function readConfig() {
    const { path: configPath } = ensureConfigFile();
    return loadConfigFromPath(configPath);
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

    const { path: configPath, created } = ensureConfigFile();

    if (!created) {
        promptQuick('existing config detected.');
    }

    return loadConfigFromPath(configPath);
}


function saveNewConfigJson(url, sourceWindow = mainWindow){

    const trimmedUrl = typeof url === 'string' ? url.trim() : '';

    if (!trimmedUrl) {
        promptDialog(
            false,
            sourceWindow,
            {
                title: 'Invalid URL',
                message: 'Load URL cannot be empty.'
            }
        );

        return readConfig();
    }

    const { path: configPath } = ensureConfigFile();
    const currentConfig = loadConfigFromPath(configPath);
    const newConfig = {
        defaultLoadUrl: currentConfig?.defaultLoadUrl ?? DEFAULT_CONFIG.defaultLoadUrl,
        loadUrl: trimmedUrl
    };

    writeConfigFile(configPath, newConfig);

    promptQuick(`config file saved at ${configPath}`);

    promptDialog(
            true,
            sourceWindow,
            {
                title: "Saved Changes",
                message: "Config saved ! Restart application to take effects !"
            }
        )

    return newConfig;
}


function getSystemVersion() {
    return app.getVersion();
}

function promptQuick(msg, obj = {}){
    // dialog.showErrorBox(
    //     "quick prompt",
    //     '-->' + msg + obj.length? JSON.stringify(obj) : ''
    // )
}

function promptDialog(_status, _win, _props = {}){

    let defaultProps = {};

    if(_status === true){
        defaultProps.type = 'none';
        defaultProps.title = 'Success !';
    }else if(_status === false){
        defaultProps.type = 'error'
        defaultProps.title = 'Error Occurred !';
    }

    const messageBoxOptions = {
        message: '--',
        ...defaultProps,
        ..._props
    };

    dialog.showMessageBox(
        _win ?? null,
        messageBoxOptions
    );
}

function createWindowApplication() {

    //load config files
    let config = readConfig();

    let loadUrl = (config?.loadUrl || '').trim();

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

    const display = screen.getPrimaryDisplay();
    const dimensions = display.workAreaSize;

    const ratio = {width: 0.95, height: 0.95}
    const maxWidth = 1200;
    const maxHeight = 850;

    const width = Math.min(Math.round(dimensions.width * ratio.width), maxWidth);
    const height = Math.min(Math.round(dimensions.height * ratio.height), maxHeight);
    const minWidth = width;
    const minHeight = height;

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
            contextIsolation: true,
            nodeIntegration: false,
            preload: path.join(__dirname, 'preload', 'mainPreload.js')
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

    if (mainWindowSetting && !mainWindowSetting.isDestroyed()) {
        mainWindowSetting.focus();
        return;
    }

    const display = screen.getPrimaryDisplay();
    const dimensions = display.workAreaSize;

    const ratio = {width: 0.95, height: 0.95}

    const maxWidth = 600;
    const maxHeight = 425;

    const width = Math.min(Math.round(dimensions.width * ratio.width), maxWidth);
    const height = Math.min(Math.round(dimensions.height * ratio.height), maxHeight);
    const minWidth = width;
    const minHeight = height;

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
            contextIsolation: true,
            nodeIntegration: false,
            preload: path.join(__dirname, 'preload', 'settingsPreload.js')
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

ipcMain.handle('settings:readConfiguration', () => readConfig());
ipcMain.handle('settings:getSystemVersion', () => getSystemVersion());
ipcMain.handle('settings:saveConfiguration', (event, url) => {
    const sourceWindow = BrowserWindow.fromWebContents(event.sender);
    return saveNewConfigJson(url, sourceWindow);
});

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
    return saveNewConfigJson(url, mainWindow);
}

exports.readConfiguration = () => {
    return readConfig();
}

exports.getSystemVersion = () => {
    return getSystemVersion();
}
