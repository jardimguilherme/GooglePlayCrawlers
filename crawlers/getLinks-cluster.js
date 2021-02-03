const puppeteer = require("puppeteer");
const fs = require("fs");
const { Cluster } = require("puppeteer-cluster");

const importedLinks = fs
    .readFileSync("crawled data/appLinks.txt")
    .toString("utf-8")
    .split(",");
const importedJSON = JSON.parse(fs.readFileSync("crawled data/data.json"));
importedLinks.push("https://www.google.com.br/");

async function getLinks() {
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 4,
        monitor: true,
    });

    var policies = [];
    var log = [];

    await cluster.task(async ({ page, data: url }) => {
        await page.goto(url);
        var insert;

        var link = await page.evaluate(() =>
            Array.from(document.querySelectorAll(".hrTbp"),
                (element) => element.href));


        if (link.length != 6)
            insert = "https://www.google.com.br/";
        else
            insert = link[5];

        policies.push(insert);

        log.push("item #" + i + ": " + "\n"
            + "original: " + link[link.length - 1] + "\n"
            + "inserido: " + insert + "\n"
            + "posicao: " + policies.length + "\n");
        // console.log(insert)
        // console.log("item #" + i + " inserido");
    });

    fs.writeFileSync(`crawled data/policyLinks-cluster.txt`, policies);
    fs.writeFileSync(`crawled data/logs/insercoes-cluster.txt`, log);

    for (i in importedLinks)
        cluster.queue(importedLinks[i]);

    await cluster.idle();
    await cluster.close();
};

exports.getLinks = getLinks;
getLinks();