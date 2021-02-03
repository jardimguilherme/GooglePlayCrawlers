const puppeteer = require("puppeteer");
const fs = require('fs');

async function getApps() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({
        width: 2000,
        height: 4500
    });

    // get data from file
    const importedLinks = fs
     .readFileSync("crawled data/categoriesLinks.txt")
     .toString("utf-8")
     .split(",");

    const importedJSON = JSON.parse(fs.readFileSync("crawled data/data.json"));// reads data json

    // go to each category and extracts links to each app
    var topApps;
    var linksToEachApp = [];
    var appNames;
    var allAppNames = [];
    for (var i in importedLinks) {
        await page.goto(importedLinks[i], {waitUntil: 'networkidle0'});//wait until page is fully loaded
        
        // saves all links to apps
        topApps = await page.evaluate( () => 
         Array.from(document.querySelectorAll(".wXUyZd"), 
         (element) => element.querySelector("a").href)
        );
        linksToEachApp.push(topApps);

        // saves all app names
        appNames = await page.evaluate( () =>
         Array.from(document.getElementsByClassName("WsMG1c nnK0zc"),
          (element) => element.innerHTML       
         ));
         allAppNames.push(appNames);
        
        console.log(importedJSON.data[i]["category"] + ": " + linksToEachApp[i].length);
    }

    fs.writeFileSync("crawled data/appLinks.txt", linksToEachApp);
    fs.writeFileSync("crawled data/appNames.txt", allAppNames);

    await browser.close();
    console.log("categories fetched!");
    console.log("apps fetched!");
}

exports.getApps = getApps;
getApps();