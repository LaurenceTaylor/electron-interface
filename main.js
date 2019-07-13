const {app, BrowserWindow, Menu, ipcMain} = require('electron');
const url = require('url');
const path = require('path');

let win;
let addWindow;

app.on('ready', function() {
   win = new BrowserWindow({
     webPreferences: {
       nodeIntegration: true
     }
   });
   win.loadURL(url.format ({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
   }));

   win.on('closed', function() {
     app.quit();
   });

   const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
   Menu.setApplicationMenu(mainMenu);
});

function createAddWindow() {
  addWindow = new BrowserWindow({
    width:300,
    height:200,
    title:'Add Plant',
    webPreferences: {
      nodeIntegration: true
    }
  });

  addWindow.loadURL(url.format ({
     pathname: path.join(__dirname, 'addWindow.html'),
     protocol: 'file:',
     slashes: true
  }));

  addWindow.on('close', function() {
    addWindow = null;
  });
}

ipcMain.on('item:add', function(e, item) {
  win.webContents.send('item:add', item);
  addWindow.close();
});

const mainMenuTemplate = [
  {
    label:'File',
    submenu:[
      {
        label:'Add Plant',
        click() {
          createAddWindow();
        }
      },
      {
        label:'Clear Plants',
        click() {
          win.webContents.send('item:clear');
        }
      },
      {
        label:'Quit',
        click(){
          app.quit();
        }
      }
    ]
  }
];

if(process.env.NODE_ENV !== 'production') {
  mainMenuTemplate.push({
    label:'Developer Tools',
    submenu:[
      {
        label:'Toggle DevTools',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      },
      {
        role:'reload'
      }
    ]
  });
}
