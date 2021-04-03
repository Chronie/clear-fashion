// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
let currentProducts = [];
let currentPagination = {};
let sort;
let chosenbrand;
let prod;
let a;
let brands = ['default'];

// selectors initialization
const selectShow = document.querySelector('#show-select'); //if changes, updating products
const selectPage = document.querySelector('#page-select'); //document pointing on index.html
const selectSort = document.querySelector('#sort-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const spanNbProductsDisp = document.querySelector('#nbProductsdisp');
const selectBrands = document.querySelector('#brand-select');
const p50 = document.querySelector('#p50');
const p90 = document.querySelector('#p90');
const p95 = document.querySelector('#p95');
/**
 * Set global value
 * @param {Array} result - products to display //param permits to describe a parameter which will be used in a function. like an assertion to a type for example
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => { //params:data from api body => stocking in tabs
  currentProducts = result; //stocking products here every api calls
  currentPagination = meta;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch asserted to 1
 * @param  {Number}  [size=12] - size of the page
 * @return {Object} //type of return for the following function
 */
const fetchProducts = async (page = 1, size = 12) => { //calling d'API
  try {
    const response = await fetch(
      `https://clearfashion.vercel.app/products?page=${page}&size=${size}`
    );
    const body = await response.json(); //decoding to get JSON object

    if (body.success !== true) { //if decoding not working
      console.error(body);
      return {currentProducts, currentPagination};
    }
    return body.data; //having results and meta
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

function stringDate(dateObj){
  dateObj = new Date(dateObj)
  console.log(dateObj)
  let month = dateObj.getUTCMonth() + 1; 
  let day = dateObj.getUTCDate();
  let year = dateObj.getUTCFullYear();
  let newdate = day + "/" + month + "/" + year;
  return newdate
};

function rendercurrentDate(){
  let doc = document.getElementById("currentDate")
  let today = new Date();
  console.log(today);
  let day = today.getUTCDate();
  let month = today.getUTCMonth() + 1;
  let year = today.getUTCFullYear();
  today = day + '/' + month + '/' + year;
  doc.innerText = today;
}
/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => { //Showing every products
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}€ </span>
        <span>${stringDate(product.date)}</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

const renderBrands = (products,chosenbrand) => {
  let index = 0;
  products.forEach(function(product){
    if(brands.includes(product.brand) == false){
      brands.push(product.brand);
    }
    });
    console.log("brands="+brands);

    selectBrands.innerHTML = Array.from( //get each particular element in an array and apply a function on it.
      brands, name => `<option value="${name}">${name}</option>`);
      for (let i = 0; i < brands.length;i++ ){
        if(brands[i] == chosenbrand){
          index = i;
        }
      }
      selectBrands.selectedIndex = index;

    };

  const percentileIndex = (products, percentile) =>
    Math.floor((products.length - 1) * percentile / 100) + 1;

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = (pagination, products) => {
  const {count} = pagination;
  //const {pageSize} = products.length;
  spanNbProducts.innerHTML = count;
  spanNbProductsDisp.innerHTML = products.length;

  let sortedprod = clone(products);
  sortbypriceasc(sortedprod);
  p50.innerHTML = sortedprod[percentileIndex(sortedprod,50)].price;
  p90.innerHTML = sortedprod[percentileIndex(sortedprod,90)].price;
  p95.innerHTML = sortedprod[percentileIndex(sortedprod,95)].price;


};


const render = (products, pagination) => {
  rendercurrentDate()
  if(chosenbrand){
    products = byBrand(currentProducts,chosenbrand);

  }
  sorting(sort,products);
  renderBrands(products,chosenbrand);
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination, products);
};


const sortbypriceasc = (products) => {
  products.sort(function(a,b){
    {return a.price - b.price}
  });
};
const sortbypricedesc = (products) => {
  products.sort(function(a,b){
    {return b.price - a.price}
  });
};

const sortbydateasc = (products) =>  {
  products.sort(function(a,b){
    return new Date(b.date) - new Date(a.date);
  });
}

const sortbydatedesc = (currentProducts) =>  {
  currentProducts.sort(function(a,b){
    return new Date(a.date) - new Date(b.date);
  });
}

const byBrand = (currentProducts, chosenbrand) => {
  if(chosenbrand != 'default'){
    let productofabrand = []
    currentProducts.forEach(function(product){
      if(product.brand == chosenbrand){
        productofabrand.push(product);
      }
    });
    return productofabrand

  }
  else{
    return currentProducts
  }

}

const clone = obj => {
  try{
    var copy = JSON.parse(JSON.stringify(obj));
  } 
  catch(e){
    alert('Use a modern navigator please');
  }
  return copy;
};

const sorting = (sort, products) => {
  switch(sort){
    case "price-asc":
      sortbypriceasc(products);
      break;
    case "price-desc":
      sortbypricedesc(products);
      break;
    
    case "date-asc":
      sortbydateasc(products);
      break;

    case "date-desc":
      sortbydatedesc(products);
      break;
    default:
      break;
  }

};
/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 * @type {[type]}
 */
selectShow.addEventListener('change', event => {
  fetchProducts(currentPagination.currentPage, parseInt(event.target.value)) //page requesting from api not every time at 1, size depending on event
    .then(setCurrentProducts) //when fetchproducts ahas finished: calling setcurrentproducts
    .then(() => render(currentProducts, currentPagination));
});

selectPage.addEventListener('change',event => {
  fetchProducts(parseInt(event.target.value),selectShow.value)
  .then(setCurrentProducts)
  .then(() => render(currentProducts,currentPagination));
}); 

selectSort.addEventListener('change', event => {
 sort = event.target.value;
 render(currentProducts,currentPagination);
});

selectBrands.addEventListener('change', event => {
  chosenbrand = event.target.value;
  //prod = byBrand(currentProducts,chosenbrand);
  render(currentProducts,currentPagination);

})

document.addEventListener('DOMContentLoaded', () =>
  fetchProducts() //returns intel from api, result et meta
    .then(setCurrentProducts) //when fetchproducts finished: calling setcurrentproducts
    .then(() => render(currentProducts, currentPagination)) // setcurrentproducts called, then render
);
