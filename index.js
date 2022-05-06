const express = require('express');
const app = express();
const ObjectId = require('mongodb').ObjectId
const port = process.env.PORT || 5000;
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const jwt = require('jsonwebtoken')

// middleware 
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('server running...')
})

// mongodb 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.moy4n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){

try{

  await client.connect()
  const prodCollection = client.db('lsnmart').collection('products');

  // load all products 
  app.get('/products', async(req, res) => {
    const size = Number(req.query.size);
    const query = {};
    const cursor = prodCollection.find(query);
    const result = await cursor.limit(size).toArray();
    console.log(result.length)
    res.send(result)
  })
  // load single product
  app.get('/product', async(req, res) => {
    const prodId = req.query.prod;
    const query = {_id: ObjectId(prodId)};
    const result = await prodCollection.findOne(query);
    res.send(result)
  })
  // update increase and decrease quantity 
  app.put('/update', async(req, res) => {
    const newQuantity = {quantity: Number(req.query.quantity)};
    const id = req.query.id;
    const find = {_id: ObjectId(id)};
    const options = { upsert: true };
    const updatedQuantity = {
      $set: newQuantity
    }
    const result = await prodCollection.updateOne(find, updatedQuantity, options);
  })
  // remove item 
  app.get('/remove', async(req, res) => {
    const id = req.query.rmitem;
    const query = {_id: ObjectId(id)};
    const result = await prodCollection.deleteOne(query);
    res.send(result)
  })
  // add items 
  app.post('/additem', async(req, res) => {
    const item = req.body;
    const result = await prodCollection.insertOne(item);
  })

  // verify jwt token 
  function verifyJwt(req, res, next){
    const myToken = JSON.parse(req.headers.authorization.split(' ')[1]);
    if(!myToken){
      return res.status(401).send({message:'unauthorized access'});
    }
    jwt.verify(myToken, process.env.ACCESS_TOKEN, (error, decoded) => {
      if(error){
        return res.status(403).send({message:'forbidden access'})
      }
      req.decoded = decoded;
      next()
    })
  }

  // get item filtered by email 
  app.get('/myitems', verifyJwt, async(req, res) => {
    const email = req.query.email;
    const decodedEmail = req.decoded;
    if(email === decodedEmail){
      const query = {email};
      const cursor = prodCollection.find(query);
      const result = await cursor.toArray();
      res.send(result)
    }
    else{
      res.status(403).send({message:'forbidden access'})
    }
  })
  app.get('/signin', async(req, res) => {
    const user = req.query.email;
    const token = jwt.sign(user, process.env.ACCESS_TOKEN);
    res.send(token);
  })

}
finally{

}

}
run()

app.listen(port, () => {
  console.log('connecter server')
})