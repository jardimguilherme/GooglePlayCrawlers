const puppeteer = require("puppeteer");
const fs = require("fs");

var importedLinks = fs
    .readFileSync("crawled data/appLinks.txt")
    .toString("utf-8")
    .split(",");
const importedJSON = JSON.parse(fs.readFileSync("crawled data/data.json"));
importedLinks.push("https://www.google.com.br/");


async function getLinks() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    var policies = [];
    var log = [];
    var link;
    var insert;
    var name;

    for (i in importedLinks) {
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

        console.log("item #" + i
            + " inserido "
            + "(" + insert + ")");

        if (i < 200)
            name = importedJSON.data[0]['category'];
        else if (i < 400)
            name = importedJSON.data[1]['category'];
        else if (i < 600)
            name = importedJSON.data[2]['category'];
        else if (i < 800)
            name = importedJSON.data[3]['category'];
        else if (i < 1000)
            name = importedJSON.data[4]['category'];
        else if (i < 1200)
            name = importedJSON.data[5]['category'];


        // saves links and log
        fs.writeFileSync(`crawled data/policyLinks(${name}).txt`, policies);
        fs.writeFileSync(`crawled data/logs/insercoes(${name}).txt`, log);
    }

    await browser.close();
}

exports.getLinks = getLinks;
getLinks();