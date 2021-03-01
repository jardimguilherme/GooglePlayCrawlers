const puppeteer = require("puppeteer");
const fs = require("fs");

var importedLinks = fs
  .readFileSync("crawled data/allLinks.txt")
  .toString("utf-8")
  .split(",");

async function getPolicies() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);

  for (i in importedLinks) {
    var url = importedLinks[i]
    await page.goto(url).catch(function (err) {
      console.log("erro: " + err);
    });

    var data = await page.content();

    fs.writeFileSync(`crawled data/policies/page${i}.html`, data);
    console.log("page #" + i + " downloaded!");
  }
}

exports.getPolicies = getPolicies;
getPolicies();
