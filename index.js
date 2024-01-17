const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express()
const port = process.env.PORT || 3000;

// middleware
app.use(cors())
app.use(express.json())

const db_user = process.env.DB_USER
const db_password = process.env.DB_PASSWORD





const uri =
  `mongodb+srv://${db_user}:${db_password}@cluster0.7tma2za.mongodb.net/?retryWrites=true&w=majority`;
 

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});


const users = [
  { name: 'rabiul' },
  {name: 'sohel'}
]

async function run() {
  const db = client.db('coffeDB')
  const coffeCollection = db.collection('coffee')
  const userCollection = client.db('coffeeDB').collection('users')
  
  try {
    // Connect the client to the server	(optional starting in v4.7)

    await client.connect();

    app.post('/coffee', async (req, res) => {
      const coffee = req.body;
      const result = await coffeCollection.insertOne(coffee)
      res.send(result)
      
    })

    app.get('/coffee', async(req, res) => {
      const cursor =  coffeCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await coffeCollection.findOne(query)
      res.send(result)
    })
    app.put('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const coffee = req.body;
      const updatedCoffee = {
        $set: {
          name: coffee.name,
          photo: coffee.photo,
          taste: coffee.chef,
          supplier: coffee.supplier,
          taste: coffee.taste

        }
      }
      const result = await coffeCollection.updateOne(filter, updatedCoffee, options)
      res.send(result)
    })
    
    app.delete('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await coffeCollection.deleteOne(query)
      res.send(result)
    })

    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user)
      res.send(result)
    })
    app.get('/users', async (req, res) => {
      const cursor = userCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    app.patch('/user', async (req, res) => {
      const users = req.body;
      const filter = { email: users.email }
      const options = {upsert: true}
      const updatedUser = {
        $set: {
          lastLoggedTime: users.lastLoggedTime
        },
      };
      const result = await userCollection.updateOne(filter, updatedUser, options)
      res.send(result)
    })
    // app.get('/user/:id')
    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) } 
      const result = await userCollection.deleteOne(query)
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('hello coffee world')
})
app.listen(port, () => {
  console.log(`app is running on port ${port}`);
})