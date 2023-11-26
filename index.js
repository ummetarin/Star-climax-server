const express = require('express');

const app=express();

const cors = require('cors');
require('dotenv').config()
const port=process.env.PORT||3000;


// middleware
app.use(cors());
app.use(express.json())




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fdvzwaw.mongodb.net/?retryWrites=true&w=majority`;

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

    const Carddata=client.db('AppertmentData').collection('apert-room')
    const Reviewdata=client.db('AppertmentData').collection('review')
    const wishlistdata=client.db('AppertmentData').collection('wishlistdata')
    const revdatacoll=client.db('AppertmentData').collection('reviewdata')
    const userCollection=client.db('AppertmentData').collection('userdata')



   app.get('/roomdata',async(req,res)=>{
    const result=await Carddata.find().toArray();
    res.send(result);
   })

   app.get('/roomdata/:id', async (req,res) => {
    const id = parseInt(req.params.id);
    const query = { ID : id };
    const result = await Carddata.findOne(query);
    res.send(result);
   })

  // wishlist

  // app.post('/wishdata',async (req,res)=>{
  //    const wishlist=req.body;
  //   //  console.log(wishlist);
  //   const result=await wishlistdata.insertOne(wishlist);
  //   res.send(result)

  // } )



  // rev

//   app.post('/revdata',async (req,res)=>{
//     const reviewdata=req.body;
//     console.log(reviewdata);
//    const result=await revdatacoll.insertOne(reviewdata);
//    res.send(result)

//  } )


// User data

app.post('/user',async (req,res)=>{
  const userdata=req.body;
  console.log(userdata);
 const result=await userCollection.insertOne(userdata);
 res.send(result)

} )





   //review

   app.get('/revdata',async(req,res)=>{
    const result=await Reviewdata.find().toArray();
    res.send(result);
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




app.get('/',(req,res)=>{
    res.send("appertment is working")
})

app.listen(port,()=>{
    console.log(`Appertment is on port ${port}`);
})
