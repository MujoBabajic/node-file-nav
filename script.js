const fs = require("fs");
const readline = require("readline");
const path = require("path");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function displayCommands() {
  console.log(`Available commands:
  ls - List files in current directory
  mkdir <directory_name> - Create a new directory
  cd <directory_name> - Change directory
  touch <file_name> - Create a new file
  read <file_name> - Read a file
  cp <source_file> <destination_file> - Copy a file
  rm <file_or_directory_name> - Delete a file or directory
  help - Display available commands
  exit - Exit the program`);
}

function listFiles() {
  fs.readdir("./", (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }
    console.log("Files in current directory:");
    files.forEach((file) => {
      console.log(file);
    });
  });
}

function createDirectory(directoryName) {
  fs.mkdir(directoryName, (err) => {
    if (err) {
      console.error("Error creating directory:", err);
      return;
    }
    console.log(`Directory '${directoryName}' created successfully.`);
  });
}

function changeDirectory(directoryName) {
  fs.access(directoryName, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`Directory '${directoryName}' does not exist.`);
      return;
    }
    process.chdir(directoryName);
    console.log(`Changed directory to '${directoryName}'.`);
  });
}

function createFile(fileName) {
  fs.writeFile(fileName, "", (err) => {
    if (err) {
      console.error("Error creating file:", err);
      return;
    }
    console.log(`File '${fileName}' created successfully.`);
  });
}

function readFile(fileName) {
  fs.readFile(fileName, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }
    console.log(`Contents of '${fileName}':`);
    console.log(data);
  });
}

function copyFile(sourceFile, destinationFile) {
  fs.copyFile(sourceFile, destinationFile, (err) => {
    if (err) {
      console.error("Error copying file:", err);
      return;
    }
    console.log(
      `File '${sourceFile}' copied to '${destinationFile}' successfully.`
    );
  });
}

function deleteFileOrDirectory(name) {
  fs.stat(name, (err, stats) => {
    if (err) {
      console.error("Error accessing file/directory:", err);
      return;
    }
    if (stats.isDirectory()) {
      fs.rm(name, { recursive: true }, (err) => {
        if (err) {
          console.error("Error deleting directory:", err);
          return;
        }
        console.log(`Directory '${name}' deleted successfully.`);
      });
    } else {
      fs.unlink(name, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
          return;
        }
        console.log(`File '${name}' deleted successfully.`);
      });
    }
  });
}

function executeCommand(input) {
  const [command, ...args] = input.trim().split(" ");

  switch (command) {
    case "ls":
      listFiles();
      break;
    case "mkdir":
      createDirectory(args[0]);
      break;
    case "cd":
      changeDirectory(args[0]);
      break;
    case "touch":
      createFile(args[0]);
      break;
    case "read":
      readFile(args[0]);
      break;
    case "cp":
      copyFile(args[0], args[1]);
      break;
    case "rm":
      deleteFileOrDirectory(args[0]);
      break;
    case "help":
      displayCommands();
      break;
    case "exit":
      rl.close();
      break;
    default:
      console.log(
        'Command not recognized. Type "help" to see available commands.'
      );
  }
}

console.log("Welcome to the Node.js File Manager!");
displayCommands();

rl.setPrompt("> ");
rl.prompt();

rl.on("line", (input) => {
  executeCommand(input);
  rl.prompt();
});

rl.on("close", () => {
  console.log("Exiting the File Manager. Goodbye!");
  process.exit(0);
});
