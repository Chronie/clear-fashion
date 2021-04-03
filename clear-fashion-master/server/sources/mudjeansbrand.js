const axios = require('axios'); 
const cheerio = require('cheerio');

const parse = data => {
    const $ = cheerio.load(data); 
    return $('.right-block') 
    .map((i, element) => { 
      const name = $(element) 
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


  function parsecategories (data) {
    let urls_cat = [];
    const $ = cheerio.load(data);
    $('.hero-button a').each((i,el) => {
      const item = $(el).attr('href');
      urls_cat.push(item);
    })
    return urls_cat;
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