const {MongoClient} = require('mongodb');


const MONGODB_URI = 'mongodb+srv://PierreC:PierrotMoNgo!15@cluster0.w59pl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const MONGODB_DB_NAME = 'clearfashion';

let client = null;
let database = null;


async function getDB(){
    try {
        if (database) {
          console.log('💽  Already Connected');
          return database;
        }
    
        client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
        database = client.db(MONGODB_DB_NAME);
    
        console.log('💽  Connected');
    
        return database;
      } catch (error) {
        console.error('🚨 MongoClient.connect...', error);
        return null;
      }
}


async function insertion(products) {
    try {
        const db = await getDB();
        const collection = db.collection('products');
        // More details
        // https://docs.mongodb.com/manual/reference/method/db.collection.insertMany/#insert-several-document-specifying-an-id-field
        const result = await collection.insertMany(products, {'ordered': false});
    
        return result;
      } catch (error) {
        console.error('🚨 collection.insertMany...', error);
        fs.writeFileSync('products.json', JSON.stringify(products));
        return {
          'insertedCount': error.result.nInserted
        };
      }
}


async function querydata(query){
    try {
        const db = await getDB()
        const collection = db.collection('products');
        const result = await collection.find(query).toArray();
        return result
      } 
      catch(error){
          console.error('Your query cannot be processed',error);
          return null;
      }
    }

async function addDate(){
  try {
    const db = await getDB()
    const collection = db.collection('products');
    const result = await collection.find().toArray();
    d
    return result
  } 
  catch(error){
      console.error('Your query cannot be processed',error);
      return null;
  }

}

async function close(){
  try{
    await client.close()
  }catch(error){
    console.error('🚨 MongoClient.close...', error);
  }
}
    module.exports =  {close,insertion,querydata};