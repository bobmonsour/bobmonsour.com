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
    // console.log("bundleitems called");
    return airtableData;
  } catch (err) {
    throw new Error(err);
  }
};
