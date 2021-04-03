const axios = require('axios'); 
const cheerio = require('cheerio');

const parse = data => {
    const $ = cheerio.load(data); 
    return $('.right-block') //asking for retrieving elements from dom pointing on selector
    .map((i, element) => { //products scraped. maping for scrolling
      const name = $(element) //on product, applying following functions to get product name
        .find('.product-name')
        .attr('title')
      const price = parseInt( 
        $(element)
          .find('.price')
          .text()
      );
        return {name, price}; 
      })
      .get(); 
  };

module.exports.scrape = async url => { 
  const response = await axios(url);
  const {data, status} = response; 

  if (status >= 200 && status < 300) { 
    return parse(data);
  }

  console.error(status);

  return null;
};