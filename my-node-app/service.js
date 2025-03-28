const { Service } = require("node-windows");
const path = require("path");
const isDev = process.env.NODE_ENV === 'development';

// Get the correct path for the script
const getScriptPath = () => {
    if (isDev) {
        return path.join(__dirname, "app.js");
    } else {
        // In production, the app.js is in the resources directory
        return path.join(process.resourcesPath, "app.asar", "app.js");
    }
};

// Create a new service object
const svc = new Service({
    name: "My Node App",
    description: "My Node App",
    script: getScriptPath(),
    nodeOptions: [
        '--harmony',
        '--max_old_space_size=4096'
    ]
});

// Listen for the install event
svc.on("install", () => {
    console.log("Service installed successfully");
    svc.start();
});

// Listen for the alreadyinstalled event
svc.on("alreadyinstalled", () => {
    console.log("Service is already installed");
});

// Listen for the error event
svc.on("error", (err) => {
    console.error("Service error:", err);
});

// Listen for the stop event
svc.on("stop", () => {
    console.log("Service stopped");
});

// Listen for the restart event
svc.on("restart", () => {
    console.log("Service restarted");
});

// Install the service
svc.install();