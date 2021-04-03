/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand'); //stocking results in dedicatedbrand.js
const adressebrand = require('./sources/adressebrand');
const mudjeans= require('./sources/mudjeansbrand');

const cheerio = require('cheerio');


async function sandbox (eshop = 'https://www.dedicatedbrand.com/en/men',brand) { //default URL <=> Scraped default page
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} source`); //Shower in node server

    const products = await brand.scrape(eshop); //stocking scrap results on linked page
    //dedicatedbrand is a modul, and scrap a function
    return products
    //console.log(products);
    //console.log('done');
  } catch (e) {
    console.log("error");
    console.error(e);
  }

}



async function retrieveurls(eshop = 'https://www.dedicatedbrand.com/en/'){
  try {

    const urls = await dedicatedbrand.scrapecategories(eshop); //stocking scrap results on linked page
    //dedicatedbrand dedicatedbrand is a modul, and scrap a function
    urls.forEach(function(url){
      sandbox(url);
    })

  } catch (e) {
    console.error(e);
  }
}

async function mudjeansprod(eshop = 'https://mudjeans.eu/'){
  try {

    const urls = await adressebrand.scrapecategories(eshop); //stocking scrap results on linked page
    //dedicatedbrand dedicatedbrand is a modul, and scrap a function
    urls.forEach(function(url){
      sandbox(url);
    })

  } catch (e) {
    console.error(e);
  }
}

const [,, eshop] = process.argv;
//retrieveurls();
//sandbox(eshop);
module.exports = {sandbox,retrieveurls};


