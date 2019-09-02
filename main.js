// Modules to control application life and create native browser window
if (require('electron-squirrel-startup')) return;
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const os = require("os")

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
var dataPath
if (process.platform === "win32"){
  dataPath = "C:/Users/"+os.userInfo().username+"/AppData/Local/quickrpc/data.qrpc"
} else if (process.platform === "darwin"){
  dataPath = "~/Library/Application Support/quickrpc/data.qrpc"
} else if (process.platform === "linux"){
  dataPath = "~/.config/quickrpc/data.qrpc"
}


var Datastore = require('nedb')
  , db = new Datastore({ filename: dataPath, autoload: true });


function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 300,
    height: 400,
    title: 'Discord Rich Presence Editor',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })
  mainWindow.setMenu(null)
  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  // var rpid,state,details,startTimestamp,endTimestamp,largeImageKey,smallImageKey,partySize,partyMax

  mainWindow.webContents.on('did-finish-load', () => {
    db.findOne({dataID: 1}, function (err, data) {
      if (err) console.error(err)
      if (data === null || data.clientid === undefined){
        return
      } else {
        mainWindow.webContents.send('ping', data)
      }
  })


  
  });

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


var id

ipcMain.on('submitForm', function(event, data) {
  console.log(data)
  const client = require('discord-rich-presence')(data.clientid);
  client.updatePresence({
    state: data.state,
    details: data.details,
    startTimestamp: data.startTimestamp,
    endTimestamp: data.endTimestamp,
    largeImageKey: data.largeImageKey,
    smallImageKey: data.smallImageKey,
    partySize: data.partySize,
    partyMax: data.partyMax,
    instance: true
  })
  db.remove({ dataID: 1 }, {}, function (err, numRemoved) {if (err) console.error(err)})
  db.insert(data, function(err, newDoc){
    if (err) console.error(err)
    id = newDoc._id
  })
});