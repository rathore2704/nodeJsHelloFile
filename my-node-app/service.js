const { Service } = require("node-windows");
const path = require("path");
const fs = require("fs");

// Get the correct path for the script
const getScriptPath = () => {
    const scriptPath =  path.join(process.resourcesPath || __dirname, "app.asar.unpacked", "app.js");
    console.log("Resolved script path:", scriptPath); // Log the resolved path
    return scriptPath;
};

// Ensure the daemon directory exists
const ensureDaemonDirectory = () => {
    const daemonPath = path.join(process.resourcesPath || __dirname, "app.asar.unpacked", "daemon");
    if (!fs.existsSync(daemonPath)) {
        fs.mkdirSync(daemonPath, { recursive: true });
        console.log("Created daemon directory:", daemonPath);
    }
};

// Call the function to ensure the directory exists
ensureDaemonDirectory();

// Create a new service object
const svc = new Service({
    name: "APP_WINDOWs_SERVICE",
    description: "APP TEST WINDOWS SERVICE",
    script: getScriptPath(),
    nodeOptions: [
        '--harmony',
        '--max_old_space_size=4096'
    ]
});

console.log("Service script path:", getScriptPath());

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