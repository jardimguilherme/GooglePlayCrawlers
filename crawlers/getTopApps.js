const puppeteer = require("puppeteer");
const fs = require('fs');
const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // abre a página inicial
    await page.goto("https://play.google.com/store/apps/top");

    const topCategories = await page.evaluate( () => 
        Array.from(document.querySelectorAll(".xwY9Zc"), (element) => element.querySelector("a").href)
    );

    console.log(topCategories);

    await browser.close();
})();