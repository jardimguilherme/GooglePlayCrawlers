// importing dependencies
const { Cluster } = require("puppeteer-cluster");
const puppeteer = require("puppeteer");
const fs = require("fs");

//importing scripts
const categories = require("./getCategories");
// const apps = require("./getApps");
// const links = require("./getLinks");
// const policies = require("./getPolicies");

var importedLinks = [];
const importedJSON = JSON.parse(fs.readFileSync("crawled data/data.json"));
for (var i = 0; i < importedJSON.data.length; i++) {
  var temp = fs
    .readFileSync(`crawled data/policyLinks(${importedJSON.data[i]["category"]}).txt`)
    .toString("utf-8")
    .split(",");

  importedLinks.push(...temp);
}


(async () => {
  // fetch categories
  console.log("fetching categories...");
  await categories.getCategories().catch(function (err) {
    console.log("fetch categories error: " + err);
  });

  // fetch apps
  console.log("fetching apps...");
  await apps.getApps().catch(function (err) {
    console.log("fetch apps error: " + err);
  });

  // fetch links
  console.log("fetching links...");
  await links.getLinks().catch(function (err) {
    console.log("fetch links error: " + err);
  });

})();