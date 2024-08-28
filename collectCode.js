// Import required modules
const fs = require("fs");
const path = require("path");

// Define the directory paths
const directories = [
  "/Users/spade/Desktop/energy-plan-calculator/src/components",
  "/Users/spade/Desktop/energy-plan-calculator/src/hooks",
  "/Users/spade/Desktop/energy-plan-calculator/src/utils",
  "/Users/spade/Desktop/energy-plan-calculator/src", // For files like App.js, index.js, etc.
];

// Define the output file
const outputFile = "/Users/spade/Desktop/energy-plan-calculator/allCode.txt";

// Function to read and write file content
function readAndWriteFiles(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error(`Error reading directory ${directory}:`, err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(directory, file);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(`Error retrieving stats for file ${filePath}:`, err);
          return;
        }

        if (
          (stats.isFile() && path.extname(file) === ".js") ||
          path.extname(file) === ".jsx"
        ) {
          fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
              console.error(`Error reading file ${filePath}:`, err);
              return;
            }

            fs.appendFile(
              outputFile,
              `\n\n// File: ${filePath}\n\n${data}`,
              (err) => {
                if (err) {
                  console.error(`Error writing to file ${outputFile}:`, err);
                }
              }
            );
          });
        }
      });
    });
  });
}

// Create or clear the output file
fs.writeFile(outputFile, "", (err) => {
  if (err) {
    console.error(`Error creating or clearing file ${outputFile}:`, err);
    return;
  }

  // Process each directory
  directories.forEach(readAndWriteFiles);
});
