const puppeteer = require("puppeteer");
const fs = require('fs');
const { get } = require("http");

async function getCategories () {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // loads top apps main page
    await page.goto("https://play.google.com/store/apps/top?hl=pt_BR");

    // crawls each top apps category link
    const categoryLinkList = await page.evaluate( () => 
        Array.from(document.querySelectorAll(".xwY9Zc"), 
         (element) => element.querySelector("a").href)
    );

    // crawls each top apps category name
    const categoryNameList = await page.evaluate( () => 
        Array.from(document.querySelectorAll(".xwY9Zc"), 
         (element) => element.querySelector("a").querySelector("h2").innerText)
    );

    // creates a JSON from names + links
    var categoriesObj = { data: [] };
    for (var i in categoryLinkList) {
        var name = categoryNameList[i];
        var link = categoryLinkList[i];

        console.log(name + " added");

        categoriesObj.data.push({
            "category"          : name,
            "link to category"  : link
        });
    }

    var tempCategoriesObj = JSON.stringify(categoriesObj);

    // saves crawled data
    fs.writeFileSync("crawled data/categoriesLinks.txt", categoryLinkList);
    fs.writeFileSync("crawled data/data.json", tempCategoriesObj);

    await browser.close();
    return categoriesObj;
}

exports.getCategories = getCategories;
getCategories();