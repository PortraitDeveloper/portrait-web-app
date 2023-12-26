import { data } from "autoprefixer";
import fs from "fs/promises";
import path from "path";

export default async function errorLog(newData) {
  const fileName = `error_log_${getFormattedDate()}.json`;
  const filePath = path.join(process.cwd(), "error-log", fileName);

  try {
    // Check if the file exists
    if (await fileExists(filePath)) {
      // If the file exists, read its content, parse it, and append new data
      const existingData = await fs.readFile(filePath, "utf8");
      const dataToAppend = JSON.parse(existingData);
      dataToAppend.push(newData);

      // Save the updated data back to the file
      await fs.writeFile(filePath, JSON.stringify(dataToAppend, null, 2));
      console.log(`Data successfully appended to ${fileName}`);
    } else {
      // If the file does not exist, create a new file and save the data
      await fs.writeFile(filePath, JSON.stringify([newData], null, 2));
      console.log(`Data successfully saved to ${fileName}`);
    }
  } catch (error) {
    console.error("Something went wrong:", error);
  }
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
}

function getFormattedDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
