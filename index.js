const express = require('express');

const app=express();

const cors = require('cors');
const jwt=require('jsonwebtoken')

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
    const agentdata=client.db('AppertmentData').collection('agentdata')
    const GEtoffer=client.db('AppertmentData').collection('Offerdata')
    const Sellrelated=client.db('AppertmentData').collection('savebuy')

// jwt

  app.post('/jwt',async(req,res)=>{
  const user=req.body;
  const token=jwt.sign(user,process.env.ACCESS_TOKEN,{
      expiresIn:'3h'

  })
  res.send({token});


  })

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

  app.get('/wishdata',async(req,res)=>{
    const result=await wishlistdata.find().toArray();
    res.send(result);
   })

   app.get('/wishdata/:id', async (req,res) => {
    const id = parseInt(req.params.id);
    const query = { ID : id };
    const result = await wishlistdata.findOne(query);
    res.send(result);
   })


  app.post('/wishdata',async (req,res)=>{
     const wishlist=req.body;
    //  console.log(wishlist);
    const result=await wishlistdata.insertOne(wishlist);
    res.send(result)

  } )
// agent

app.get('/agentdataforallcard',async(req,res)=>{
  const result=await agentdata.find().toArray();
  res.send(result);
 })

app.get('/agentdata/:id',async(req,res)=>{
  const id=parseInt(req.params.id);
  const query={ID:id};
  const result=await Carddata.findOne(query)
  res.send(result);
 })

app.post('/agentdata',async (req,res)=>{
  const wishlist=req.body;
  const query={ID:wishlist.id}
  const exit=await agentdata.findOne(query);
  if(exit){
    return res.send({message:"user already ace",insertedId:null})
  }
 //  console.log(wishlist);
 const result=await agentdata.insertOne(wishlist);
 res.send(result)

 
} )


// buyrelated
app.get('/approveddata/:id',async(req,res)=>{
  const id=parseInt(req.params.id);
  const query={ID:id};
  const result=await Sellrelated.findOne(query)
  res.send(result);
  
 })


app.post('/approveddata',async (req,res)=>{
  const wishlist=req.body;
  const query={ID:wishlist.id}
 //  console.log(wishlist);
 const result=await Sellrelated.insertOne(wishlist);
 res.send(result)

 
} )


  // rev
  app.get('/revdata',async(req,res)=>{
    const result=await revdatacoll.find().toArray();
    res.send(result);
   })

   app.get('/revdata/:email',async(req,res)=>{
    const email=req.params.email;
    const query={revemail:email};
    const result=await revdatacoll.findOne(query)
    res.send(result);
   })

   app.get('/revdata/:id',async(req,res)=>{
    const id=parseInt(req.params.id);
    const query={RoomNumber:id};
    const result=await revdatacoll.findOne(query)
    res.send(result);
   })

  //  app.get('/revdata/:id',async(req,res)=>{
  //   const id = parseInt(req.params.id);
  //   const query = {RoomNumber : id };
  //   const result = await revdatacoll.findOne(query);
  //   res.send(result);
  //  })

  // app.get('/revdata/:email',async(req,res)=>{
  //   const result=await revdatacoll.find().toArray();
  //   res.send(result);
  //  })

  app.post('/revdata',async (req,res)=>{
    const reviewdata=req.body;
    console.log(reviewdata);
   const result=await revdatacoll.insertOne(reviewdata);
   res.send(result)

 } )
// offfer data

app.get('/offerdata',async(req,res)=>{
  const result=await GEtoffer.find().toArray();
  res.send(result);
 })

app.post('/offerdata',async (req,res)=>{
  const wishlist=req.body;
  const query={ID:wishlist.id}
 //  console.log(wishlist);
 const result=await GEtoffer.insertOne(wishlist);
 res.send(result)

 
} )
 


// User data
app.get('/user',async(req,res)=>{
  const result=await userCollection.find().toArray();
  res.send(result);
 })

app.post('/user',async (req,res)=>{
  const userdata=req.body;
  const query={email:userdata.email}
  const exit=await userCollection.findOne(query);
  if(exit){
    return res.send({message:"user already ace",insertedId:null})
  }
 const result=await userCollection.insertOne(userdata);
 res.send(result)

} )

app.delete('/user/:id',async(req,res)=>{
  const id=req.params.id;
  const query={ _id :new ObjectId(id)}
  const result=await userCollection.deleteOne(query);
  res.send(result)
 })

 app.patch('/user/admin/:id',async(req,res)=>{
  const id=req.params.id;
  const filter={_id: new ObjectId(id)};
  const updatedoc={
   $set:{
    role:'admin'
   }
  }
  const result=await userCollection.updateOne(filter,updatedoc)
  res.send(result);

 })

 app.patch('/user/agent/:id',async(req,res)=>{
  const id=req.params.id;
  const filter={_id: new ObjectId(id)};
  const updatedoc={
   $set:{
    role:'agent'
   }
  }
  const result=await userCollection.updateOne(filter,updatedoc)
  res.send(result);
  
 })



   //review

   app.get('/revdata',async(req,res)=>{
    const result=await Reviewdata.find().toArray();
    res.send(result);
   })

   app.get('/revdataarif/:id',async(req,res)=>{
    const id = req.params.id;
    // console.log(id);
    const query = { ID : parseInt(id) };
    const result = await Reviewdata.find(query).toArray();
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
