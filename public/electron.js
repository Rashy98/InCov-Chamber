const electron = require('electron');
const url = require('url');
const path = require('path');

// const server = require("../backend/index")

const {app, screen, BrowserWindow,Menu} = electron;

const isDev = require('electron-is-dev');
// require('./../flaskAPI/app.py');

let mainWindow;
let addWindow;

//Listen for app to be ready
app.on('ready',function (){
    const { width, height } = screen.getPrimaryDisplay().workAreaSize
    mainWindow = new BrowserWindow(({
        webPreferences: { nodeIntegration: true },
        width, height
    }));
    mainWindow.maximize();
    mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
    mainWindow.on('closed',function () {
        app.quit();
    })
    // mainWindow.openDevTools();

    //Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    //Insert menu
    Menu.setApplicationMenu(mainMenu);
});


//create menu template

const mainMenuTemplate = [
    {
        label:'File',
        label: 'Quit',
        accelerator:process.platform == 'darwin' ? 'Command+Q':'Ctrl+Q',
        click(){
            app.quit();
        }

    }
];
