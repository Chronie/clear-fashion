const {MongoClient} = require('mongodb');
const {sandbox,retrieveurls} = require('./sandbox');
const dedicatedbrand = require('./sources/dedicatedbrand');
const adressebrand = require('./sources/adressebrand');
const mudjeans= require('./sources/mudjeansbrand');
let prodadresseparis;

const MONGODB_URI = 'mongodb+srv://PierreC:PierrotMoNgo!15@cluster0.w59pl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const MONGODB_DB_NAME = 'clearfashion';
const client = new MongoClient(MONGODB_URI);





async function insertion() {
await client.connect();
const db =  client.db(MONGODB_DB_NAME)
const collection = db.collection('products');
const result = collection.insertMany(prodadresseparis); 
}

async function returnprod(){
    prodadresseparis = await sandbox('https://adresse.paris/630-toute-la-collection?id_category=630&n=109',adressebrand);
}
    
async function addproducts(){
    returnprod().then(insertion)
}

async function querydata(){
    try {
        await client.connect();
        const db =  client.db(MONGODB_DB_NAME)
        const collection = db.collection('products');
        // Query for a movie that has the title 'Back to the Future'
        const query = { price: 129 };
        const result = await collection.findOne(query);
        console.log(result);
      } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
      }
}
querydata()