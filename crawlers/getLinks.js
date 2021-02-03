const puppeteer = require("puppeteer");
const fs = require("fs");

const importedLinks = fs
    .readFileSync("crawled data/appLinks.txt")
    .toString("utf-8")
    .split(",");
const importedJSON = JSON.parse(fs.readFileSync("crawled data/data.json"));
importedLinks.push("https://www.google.com.br/");


async function getLinks(importedLinks, string, int) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    var policies = [];
    var log = [];
    var link;
    for (var i = int; i < (int + 200); i++) {
        var insert;
        await page.goto(importedLinks[i]);

        link = await page.evaluate(() =>
            Array.from(document.querySelectorAll(".hrTbp"),
                (element) => element.href)).catch(function (err) {
                    console.log("erro: " + err);
                });

        if (link.length != 6)
            insert = "https://www.google.com.br/";
        else
            insert = link[5];

        policies.push(insert);

        // insertions log
        log.push("item #" + i + ": " + "\n"
            + "original: " + link[link.length - 1] + "\n"
            + "inserido: " + insert + "\n"
            + "posicao: " + policies.length + "\n");
        console.log(insert)
        console.log("item #" + i + " inserido");
    }

    // saves links and log
    fs.writeFileSync(`crawled data/policyLinks(${string}).txt`, policies);
    fs.writeFileSync(`crawled data/logs/insercoes(${string}).txt`, log);

    await browser.close();
}

var array = [
    getLinks(importedLinks, importedJSON.data[0]["category"], 0),
    getLinks(importedLinks, importedJSON.data[1]["category"], 200),
    getLinks(importedLinks, importedJSON.data[2]["category"], 400),
    getLinks(importedLinks, importedJSON.data[3]["category"], 600),
    getLinks(importedLinks, importedJSON.data[4]["category"], 800),
    getLinks(importedLinks, importedJSON.data[5]["category"], 1000)
];

(async () => {
    Promise.all(array).then(() => {
        console.log("fetching links done!");
    })
})();

exports.getLinks = getLinks;
getLinks();