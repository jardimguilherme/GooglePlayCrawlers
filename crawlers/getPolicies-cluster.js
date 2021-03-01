const { log } = require("console");
const fs = require("fs");
const puppeteer = require("puppeteer");
const { Cluster } = require("puppeteer-cluster");

var importedLinks = fs
    .readFileSync("crawled data/allLinks.txt")
    .toString("utf-8")
    .split(",");

(async () => {
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 8,
        monitor: true
    });

    const download = async ({ page, data: url }) => {
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'pt'
        });
        await page.goto(url);
        const pageTitle = await page.evaluate(() => document.title);
        var data = await page.content();
        fs.writeFileSync(`crawled data/policies-cluster/${pageTitle}.html`, data);
    };

    for (i in importedLinks) {
        var insert = importedLinks[i];
        cluster.queue(insert, download);
    }

    await cluster.idle();
    await cluster.close();
})();