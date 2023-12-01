const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("NODE FILE NAV\nBILD IT, Mujo Babajic, 2023");
displayAvailableCommands();

rl.setPrompt("> ");
rl.prompt();

rl.on("line", (input) => {
  runCommand(input);
  rl.prompt();
});

rl.on("close", () => {
  console.log("Exited program");
  process.exit(0);
});

function displayAvailableCommands() {
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
  fs.readdir("./", (error, files) => {
    if (error) {
      console.error("Error reading directory:", error);
      return;
    }
    console.log("Files in current directory:");
    files.forEach((file) => {
      console.log(file);
    });
  });
}

function createDirectory(directoryName) {
  fs.mkdir(directoryName, (error) => {
    if (error) {
      console.error("Error creating directory:", error);
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
  fs.writeFile(fileName, "", (error) => {
    if (error) {
      console.error("Error creating file:", error);
      return;
    }
    console.log(`File '${fileName}' created successfully.`);
  });
}

function readFile(fileName) {
  fs.readFile(fileName, "utf8", (error, data) => {
    if (error) {
      console.error("Error reading file:", error);
      return;
    }
    console.log(`Contents of '${fileName}':\n${data}`);
  });
}

function copyFile(originalFile, destinationFile) {
  fs.copyFile(originalFile, destinationFile, (error) => {
    if (error) {
      console.error("Error copying file:", error);
      return;
    }
    console.log(
      `File '${originalFile}' copied to '${destinationFile}' successfully.`
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

function runCommand(input) {
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
      displayAvailableCommands();
      break;
    case "exit":
      rl.close();
      break;
    default:
      console.log('Unknown command. Type "help" to see available commands.');
  }
}
