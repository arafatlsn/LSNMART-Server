const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

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
    const query = {};
    const cursor = prodCollection.find(query);
    const result = await cursor.toArray();
    res.send(result)
  })

}
finally{

}

}
run()

app.listen(port, () => {
  console.log('connecter server')
})