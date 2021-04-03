const dedicatedbrand = require('./sources/dedicatedbrand');
const loom = require('./sources/loom');
const {close,insertion,querydata} = require('./db');

async function sandbox () {
    try {
      let products = [];
      let pages = [
        'https://www.dedicatedbrand.com/en/men/basics',
        'https://www.dedicatedbrand.com/en/men/sale'
      ];
  
      console.log(`🕵️‍♀️  browsing ${pages.length} pages with for...of`);
  
      // Way 1 with for of: we scrape page by page
      for (let page of pages) {
        console.log(`🕵️‍♀️  scraping ${page}`);
  
        let results = await dedicatedbrand.scrape(page);
  
        console.log(`👕 ${results.length} products found`);
  
        products.push(results);
      }
  
      pages = [
        'https://www.loom.fr/collections/hauts',
        'https://www.loom.fr/collections/bas'
      ];
  
      console.log('\n');
  
      console.log(`🕵️‍♀️  browsing ${pages.length} pages with Promise.all`);
  
      const promises = pages.map(page => loom.scrape(page));
      const results = await Promise.all(promises);
  
      console.log(`👕 ${results.length} results of promises found`);
      console.log(`👕 ${results.flat().length} products found`);
  
      console.log(results);
      console.log(results.flat());
  
      products.push(results.flat());
      products = products.flat();

      products.forEach(element => {
        element["date"] = getRandomDate(new Date(2020,11,10),new Date(2021,03,21));
        
      });

      console.log("YES"+products[1].date)
  
      console.log('\n');
  
      console.log(`👕 ${products.length} total of products found`);
  
      console.log('\n');
  
      const result = await insertion(products);
  
      console.log(`💽  ${result.insertedCount} inserted products`);
  
      console.log('\n');
  
      console.log('💽  Find Loom products only');
  
      const loomOnly = await querydata({'brand': 'loom'});
  
      console.log(`👕 ${loomOnly.length} total of products found for Loom`);
      console.log(loomOnly);
  
      close();
    } catch (e) {
      console.error(e);
    }
  }

  function getRandomDate(from,to) {
    from = from.getTime();
    to = to.getTime();
    return new Date(from+ Math.random() * (to - from));
}
  //console.log(getRandomDate(new Date(1994,11,10),new Date(1995,11,10)))
  sandbox();