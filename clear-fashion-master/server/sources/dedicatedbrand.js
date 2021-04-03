const axios = require('axios'); //depending modul
//http client: http requests and exploiting results
const cheerio = require('cheerio');
//server based on jquery. giving an api/library to scroll and change data
//interpreting html mais server sided  to modify it
const {'v5': uuidv5} = require('uuid');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
 const parse = data => {
  const $ = cheerio.load(data);

  return $('.productList-container .productList')
    .map((i, element) => {
      const link = `https://www.dedicatedbrand.com${$(element)
        .find('.productList-link')
        .attr('href')}`;

      return {
        link,
        'brand': 'dedicated',
        'price': parseInt(
          $(element)
            .find('.productList-price')
            .text()
        ),
        'name': $(element)
          .find('.productList-title')
          .text()
          .trim()
          .replace(/\s/g, ' '),
        'photo': $(element)
          .find('.productList-image img')
          .attr('src'),
        '_id': uuidv5(link, uuidv5.URL)
      };
    })
    .get();
};
//$ allows to point to elements with html by passing them into parameters

function parsecategories (data) {
  let urls_cat = [];
  const $ = cheerio.load(data);
  $('.mainNavigation-link-subMenu-link a').each((i,el) => {
    const item = $(el).attr('href');
    urls_cat.push('https://www.dedicatedbrand.com'+item);
  })
  return urls_cat;
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async url => { //importing scraping function outside, in sandbox.js
  const response = await axios(url);
  const {data, status} = response; //geting keys from response
//
//data is html from website we want to scrap
  if (status >= 200 && status < 300) { //codes http
    return parse(data);
  }

  console.error(status);

  return null;
};

module.exports.scrapecategories = async url => { //importing scraping function outside, in sandbox.js
  const response = await axios(url);
  const {data, status} = response; //geting keys from response
//
//data is html from website we want to scrap
  if (status >= 200 && status < 300) { //codes http
    return parsecategories(data);
  }

  console.error(status);

  return null;
};
