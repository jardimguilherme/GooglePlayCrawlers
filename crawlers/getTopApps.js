const puppeteer = require("puppeteer");
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({
        width: 2000,
        height: 4500
    });

    // get data from file
    const importedLinks = fs
     .readFileSync("crawled data/linksToCategories.txt")
     .toString("utf-8")
     .split(",");

    const importedJSON = JSON.parse(fs.readFileSync("crawled data/data.json"));// reads data json

    // go to each category and extracts links to each app
    var linksToEachApp = [];
    for (var i in importedLinks) {
        await page.goto(importedLinks[i], {waitUntil: 'networkidle0'});//wait until page is fully loaded
        
        // saves a screenshot of every page
        await page.screenshot( {
            path: `crawled data/screeshots/${i}.png`
        });

        const topApps = await page.evaluate( () => 
            Array.from(document.querySelectorAll(".wXUyZd"), (element) => element.querySelector("a").href)
        );

        linksToEachApp.push(topApps);
        importedJSON.data[i]["links"] = linksToEachApp[i];

        console.log(importedJSON.data[i]["category"] + ": " + linksToEachApp[i].length);
        // console.log("links loaded: " + linksToEachApp[i]);
    }

    var temp = JSON.stringify(importedJSON);
    fs.writeFileSync("crawled data/data.json", temp);
    fs.writeFileSync("crawled data/linksToApps.txt", linksToEachApp);

    await browser.close();

})();