//
// This file is here because I need to run docker as sudo for linux when running tests.
//
const { exec } = require("child_process");
const os = require("os");
const DB_TEST_PORT = 3000;

function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error);
      } else {
        resolve(stdout);
      }
    });
  });
}

// Function to start MongoDB container
async function startMongo() {
  console.log("Starting MongoDB container...");
  try {
    // Use `sudo` on Linux
    const sudo = os.platform() === "linux" ? "sudo " : "";
    await runCommand(`${sudo}docker rm -f test-mongo || true`);
    await runCommand(
      `${sudo}docker run --rm -d -p ${DB_TEST_PORT}:27017 --name test-mongo mongo:latest`
    );
  } catch (error) {
    console.error("Error starting MongoDB:", error);
    process.exit(1);
  }
}

// Function to stop MongoDB container
async function stopMongo() {
  console.log("Stopping MongoDB container...");
  try {
    await runCommand("docker stop test-mongo");
    console.log("MongoDB container stopped.");
  } catch (error) {
    console.error("Error stopping MongoDB:", error);
    process.exit(1);
  }
}

startMongo();