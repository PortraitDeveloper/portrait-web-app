// pages/api/downloadExcel.js

import { writeFileSync } from "fs";
import { parse } from "url";
import { join } from "path";
import { parse as parseQuery } from "querystring";
import { utils, writeFile } from "xlsx";

export default async function handler(req, res) {
  try {
    const { query } = parse(req.url);
    const { data } = parseQuery(query);

    // Assuming data is an array of objects
    const jsonData = JSON.parse(data);

    const worksheet = utils.json_to_sheet(jsonData);

    const filePath = join(
      process.cwd(),
      "public",
      "downloads",
      "excelFile.xlsx"
    );
    writeFileSync(
      filePath,
      writeFile(
        { SheetNames: ["Sheet1"], Sheets: { Sheet1: worksheet } },
        { bookType: "xlsx", type: "buffer" }
      )
    );

    // Set the response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=excelFile.xlsx");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Pragma", "no-cache");

    // Send the file as response
    res.status(200).sendFile(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}
