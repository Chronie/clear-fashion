const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const {querydata} = require('./db');
const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());
app.get('/', (request, response) => {
  response.send({"ack":true})
});

app.get('/products', async (req, res) => {
  //response.send({'a': true});
  let page = parseInt(req.query.page);
  let size = parseInt(req.query.size);
  let start = (size*(page-1));
  console.log("start= "+start);
  console.log("end=" +start + size);
  let prod = []
  let counter = 0;
  const result = await querydata({"price":{$ne:Number("Nan")}})

  for(i=start;i<start+size;i++){
      if(result[i] != null){
        console.log(i+' '+result[i].price)
        prod.push(result[i])
        counter++;

      }

    }
  console.log(counter);
  res.send({"success":true,"data":{"result":prod,"meta":{"currentPage":page,"pageCount":Math.round(result.length/size),"pageSize":size,"count":result.length}}});
});

app.get('/products/search', async (req, res) => {
  let limit = 12
  if(req.query.limit){
    limit = req.query.price;
  }
  let prod = []
  const result = await querydata({'brand':req.query.brand,'price':{"$lte": parseFloat(req.query.price)}})
  for(i=0;i<limit;i++){
    prod.push(result[i])
  }
prod.sort(function(a,b){
  {return a.price - b.price}
});
res.send(prod);
});

app.get('/products/:id', async (request, response) => {
    const prod = await querydata({'_id': request.params.id});
    response.send(prod);

});

app.listen(PORT);
console.log(`📡 Running on port ${PORT}`);