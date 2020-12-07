const puppeteer = require("puppeteer");
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // loads top apps main page
    await page.goto("https://play.google.com/store/apps/top?hl=pt_BR");

    // crawls each top apps category link
    const topCategoriesLinks = await page.evaluate( () => 
        Array.from(document.querySelectorAll(".xwY9Zc"), (element) => element.querySelector("a").href)
    );

    // crawls each top apps category name
    const topCategoriesNames = await page.evaluate( () => 
        Array.from(document.querySelectorAll(".xwY9Zc"), (element) => element.querySelector("a").querySelector("h2").innerText)
    );

    // creates a JSON from names + links
    var categoriesObj = { data: [] };
    for (var i in topCategoriesLinks) {
        var name = topCategoriesNames[i];
        var link = topCategoriesLinks[i];

        console.log(name + " added");

        categoriesObj.data.push({
            "category"          : name,
            "link to category"  : link
        });
    }
    const data = JSON.stringify(categoriesObj);

    // saves crawled data
    fs.writeFileSync("crawled data/linksToCategories.txt", topCategoriesLinks);
    fs.writeFileSync("crawled data/data.json", data);

    await browser.close();
})();