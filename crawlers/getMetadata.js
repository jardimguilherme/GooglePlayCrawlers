const puppeteer = require("puppeteer");
const fs = require('fs');
const reader = require('xlsx');

const importedLinks = fs
    .readFileSync("crawled data/appLinks.txt")
    .toString("utf-8")
    .split(",");
const file = reader.readFile('crawled data/metadata.xlsx');

(async () => {
    var data = [];
    for (var i = 0; i < importedLinks.length; i++) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(importedLinks[i]);

        // extracts metadata
        var columns = await page.evaluate(() =>
            Array.from(document.querySelectorAll(".hAyfc"),
                (element) => element.querySelector(".BgcNfc").innerText)
        );
        var rows = await page.evaluate(() =>
            Array.from(document.querySelectorAll(".hAyfc"),
                (element) => element.querySelector(".htlgb")
                    .querySelector(".IQ1z0d")
                    .querySelector(".htlgb").innerText)
        );

        columns.unshift("App Name");

        var appName = await page.evaluate(() =>
            Array.from(document.querySelectorAll(".AHFaub"),
                (element) => element.querySelector("span").innerText)
        );

        rows.unshift(appName[0]);

        var obj = {};

        for (j in columns) {
            var key = columns[j].toString();
            obj[key] = rows[j];
        }

        data.push(obj);

        console.log("link #" + i + " done!");

        await browser.close();
    }
    console.log(data);
    const ws = reader.utils.json_to_sheet(data)
    reader.utils.book_append_sheet(file, ws, "Data")

    // Writing to our file 
    reader.writeFile(file, 'crawled data/metadata.xlsx')
})();