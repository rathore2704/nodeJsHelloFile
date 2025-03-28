const { app, BrowserWindow } = require('electron');
const path = require('path');
const { Service } = require('node-windows');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

// Initialize the Windows service
const initializeService = () => {
    try {
        const serviceScript = isDev 
            ? path.join(__dirname, "service.js")
            : path.join(process.resourcesPath, "app.asar", "service.js");

        const svc = new Service({
            name: "My Node App",
            description: "My Node App",
            script: serviceScript,
            nodeOptions: [
                '--harmony',
                '--max_old_space_size=4096'
            ]
        });

        svc.on("install", () => {
            console.log("Service installed successfully");
            svc.start();
        });

        svc.on("error", (err) => {
            console.error("Service error:", err);
        });

        svc.install();
    } catch (error) {
        console.error("Failed to initialize service:", error);
    }
};

// Wait for the app to be ready before initializing the service
app.whenReady().then(() => {
    createWindow();
    initializeService();
}); 