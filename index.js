const express = require("express")
const app = express()
const cors = require("cors")
require('dotenv').config()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())

//mongodb connection
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zuwogqz.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const dataCollection = client.db("formData").collection("datas")
    // const cartCollection = client.db("bistroDb").collection("carts")

    app.get('/datas', async (req, res) => {
      const result = await dataCollection.find().toArray()
      res.send(result)
    })

    app.post('/datas', async (req, res) => {
      const item = req.body
      console.log(item)
      const result = await dataCollection.insertOne(item)
      res.send(result)
    })

    app.get('/datas/:id', async(req, res) =>{
        const id = req.params.id 
        const query = {_id: new ObjectId(id)}
        const result = await dataCollection.findOne(query)
        res.send(result)
    })

    app.put("/datas/:id", async(req, res) =>{
      const id = req.params.id 
      const updateItem = req.body 
      const options = {upsert: true}
      const filter = {_id: new ObjectId(id)}
      const updateData = {
        $set: {
          title: updateItem.title,
          status: updateItem.status,
          description: updateItem.description
        }
      }
      console.log(updateData);
      const result = await dataCollection.updateOne(filter, updateData, options)
      res.send(result)
    })

    app.delete('/datas/:id', async(req, res) =>{
        const id = req.params.id 
        const query = {_id: new ObjectId(id)}
        const result = await dataCollection.deleteOne(query)
        res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('form task is running')
})

app.listen(port, () => {
  console.log(`form app running on port ${port}`)
})
