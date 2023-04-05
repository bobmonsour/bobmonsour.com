// _data/bundleitems.js

require("dotenv").config();
const Airtable = require("airtable");
const base = new Airtable({ apiKey: process.env.AIRTABLE }).base(
  "appFlsGzwzaMZDADf"
);
module.exports = async () => {
  try {
    let airtableData = [];
    const baseName = "11tyBundleArchive";
    const viewName = "Database";
    const records = await base(baseName).select({ view: viewName }).all();
    airtableData = records.map((record) => ({
      customId: record._rawJson.id,
      ...record._rawJson.fields,
    }));
    let newTableData = airtableData.sort((a, b) => {
      console.log(a.Type.charAt(0), b.Type.charAt(0));
      return a.Type.charAt(0) - b.Type.charAt(0);
    });
    for (let i = 0; i < newTableData.length; i++) {
      console.log(newTableData[i]);
    }
    return newTableData;
  } catch (err) {
    throw new Error(err);
  }
};
