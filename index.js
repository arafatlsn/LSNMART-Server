const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');

// middleware 
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('server running...')
})

// mongodb 
function run(){
  
const uri = "mongodb+srv://<username>:<password>@cluster0.moy4n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  console.log('connected db')
  client.close();
});

}
run()

app.listen(port, () => {
  console.log('connecter server')
})