const fs = require("fs");
const { Parser } = require("json2csv");

const flatData = JSON.parse(fs.readFileSync("watchlist_flat.json", "utf-8"));

const fields = Object.keys(flatData[0]); // CSV headers
const opts = { fields };

try {
  const parser = new Parser(opts);
  const csv = parser.parse(flatData);
  fs.writeFileSync("watchlist.csv", csv);
  console.log("✅ CSV file saved as watchlist.csv");
} catch (err) {
  console.error("❌ Failed to convert to CSV:", err);
}
