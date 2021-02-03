const { Cluster } = require("puppeteer-cluster");
const fs = require("fs");

const importedLinks = fs
  .readFileSync("crawled data/appLinks.txt")
  .toString("utf-8")
  .split(",");

async function getPolicies({page, data: {url, position}}) {
  // console.log(position);
  // const browser = await puppeteer.launch();
  // const page = await browser.newPage();

  console.log("entrou");
  await page.setDefaultNavigationTimeout(0);
  await page.goto(url);

  var data = await page.content();

  fs.writeFileSync(`crawled data/policies/page${position}.html`, data);
  if (error != true) console.log("page #" + position + " downloaded!");
};

exports.getPolicies = getPolicies;
