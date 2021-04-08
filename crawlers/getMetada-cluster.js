const { log } = require("console");
const fs = require("fs");
const puppeteer = require("puppeteer");
const { Cluster } = require("puppeteer-cluster");
const reader = require('xlsx');

var importedLinks = fs
    .readFileSync("crawled data/allLinks.txt")
    .toString("utf-8")
    .split(",");

const file = reader.readFile('crawled data/metadata.xlsx');

(async () => {
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 8,
        monitor: true
    });

    var data = [];

    const download = async ({ page, data: url }) => {
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'pt'
        });
        await page.goto(url);
        
        // to do
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
    };

    const ws = reader.utils.json_to_sheet(data)
    reader.utils.book_append_sheet(file, ws, "Data")

    for (i in importedLinks) {
        var insert = importedLinks[i];
        cluster.queue(insert, download);
    }

    await cluster.idle();
    await cluster.close();
})();