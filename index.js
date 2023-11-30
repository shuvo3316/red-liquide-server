

const express=require('express')
const app=express();
const cors= require('cors')
const jwt =require('jsonwebtoken')
require('dotenv').config()


const port =  process.env.PORT||5000

// middle were 
app.use(express.json())

app.use(cors());




// username & pass 
// Master_red
// LeZb17ckl1JFBhBr


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://Master_red:LeZb17ckl1JFBhBr@cluster0.mab1nuw.mongodb.net/?retryWrites=true&w=majority";

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
    //await client.connect();
    // Send a ping to confirm a successful connectio
   // await client.db("admin").command({ ping: 1 });
   const usersCollection = client.db("Redliquide").collection('users')
   const bloodRequestCollection = client.db("Redliquide").collection('bloodRequests')
   const blogsCollection = client.db("Redliquide").collection('blogs')


   const verifyToken=(res,req,next)=>{

   }


//blog post

app.post('/blogs',async(req,res)=>{
    const data=req.body;
    const result = await blogsCollection.insertOne(data);
    res.send(result)

})
// get blogs 
app.get('/blogs',async(req,res)=>{
    const result= await blogsCollection.find().toArray();
    res.send(result)
})
//delete blog
app.delete('/blogs/:id',async(req,res)=>{
    const id=req.params.id;
    const query ={_id : new ObjectId(id)}
    console.log(query)

    const result = await blogsCollection.deleteOne(query);
    res.send(result);
})

//update blog 
app.patch('/blogs/:id',async(req,res)=>{
    const item =req.body;
    const id = req.params.id;
    console.log(id)
    const filter ={_id: new ObjectId(id)}
   if(item.role){
    const updatedDoc = {
        $set:{
            status:item.role
        }
    }
    const result = await blogsCollection.updateOne(filter,updatedDoc)
    return res.send(result);
   }
   const updatedDoc = {
    $set:{
        name:item.name,
        email:item.email,
        photo:item.photo,
        group:item.group,
       
        distric:item.distric,
        upazila:item.upazila
    }
}
   const result = await blogsCollection.updateOne(filter,updatedDoc)
   res.send(result);

   
})

//    blood- request manage 
app.post('/blood-request',async(req,res)=>{
    const data=req.body;
    const result = await bloodRequestCollection.insertOne(data);
    res.send(result)

})
app.get('/blood-request',async(req,res)=>{
    const userEmail=req.query;
    console.log(userEmail)
    let query={}
    if(req.query.email){
         query={requesterEmail:req.query.email}
    
    const result = await bloodRequestCollection.find(query).toArray();
    return res.send(result)
    }
    const result= await bloodRequestCollection.find().toArray();
    res.send(result)

})
// get specefic request 
app.get('/blood-request/:id',async(req,res)=>{
    const id=req.params.id;
   // console.log(id)
    const query={_id: new ObjectId(id)}
    const result = await bloodRequestCollection.findOne(query)
    res.send(result)

})
//update blood request specific
app.patch('/blood-request/:id',async(req,res)=>{
    const item =req.body;
    const id = req.params.id;
   // console.log(item,id)
    const filter ={_id: new ObjectId(id)}
    const updatedDoc = {
        $set:{
            recipient:item.recipient,
            address:item.address,
            distric:item.distric,
            donationdate:item.donationdate,
            donationtime:item.donationtime,
            group:item.group,
            upazila:item.upazila,
            hospital:item.hospital
        }
    }

    const result = await bloodRequestCollection.updateOne(filter,updatedDoc)
    res.send(result);
})

// delete blood request 
//delete menu
app.delete('/blood-request/:id',async(req,res)=>{
    const id=req.params.id;
    const query ={_id : new ObjectId(id)}
    console.log(query)

    const result = await bloodRequestCollection.deleteOne(query);
    res.send(result);
})


// users manage 

   app.post("/users",async(req,res)=>{
    const user =req.body;
    console.log(user)
    //user already exist kina dekhbo
    const query={email:user.email}
    const existingUser = await usersCollection.findOne(query)
    if(existingUser){
        return res.send({message :'user already exist',insertedId:null})
    }
    const result = await usersCollection.insertOne(user)
    res.send(result)
})

app.get('/users',async(req,res)=>{
    console.log(req.query.email)
    if(req.query.email){
        const query={email:req.query.email}
        const result=await usersCollection.findOne(query)
        return res.send(result)


    }
    const result=await usersCollection.find().toArray()
    res.send(result)
})
// update user info 
app.patch('/users/:id',async(req,res)=>{
    const item =req.body;
    const id = req.params.id;
    console.log(item)
    console.log(id)
    const filter ={_id: new ObjectId(id)}
   if(item.role){
    const updatedDoc = {
        $set:{
            role:item.role
        }
    }
    const result = await usersCollection.updateOne(filter,updatedDoc)
    return res.send(result);
   }
   const updatedDoc = {
    $set:{
        name:item.name,
        email:item.email,
        photo:item.photo,
        group:item.group,
       
        distric:item.distric,
        upazila:item.upazila
    }
}
   const result = await usersCollection.updateOne(filter,updatedDoc)
   res.send(result);

   
})
// update user role 
// app.patch('/users/:id',async(req,res)=>{
//     const item =req.body;
//     console.log(item)
//     const id = req.params.id;
//     const filter ={_id: new ObjectId(id)}
//     const updatedDoc = {
//         $set:{
//            role:item.role
//         }
//     }

    // const result = await usersCollection.updateOne(filter,updatedDoc)
    // res.send(result);
// })


//jwt 

app.post("/jwt",(req,res)=>{
    const user =req.body;
   // console.log(user)
    const token=jwt.sign(user,process.env.Acesss_Token,{expiresIn:'3h'})
    res.send({token})
})

    //user admin kina check
    app.get('/users/admin/:email',async(req,res)=>{
        const email = req.params.email;
        if(email!==req.params.email){
            return res.status(403).send({message: 'unauthorized access'})
            
        }
        const query={email:email}
        const user = await usersCollection.findOne(query)
        let admin = false;
        if(user){
            admin = user?.role==='admin';
        }
        res.send({admin});
    })



    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);






app.get('/',(req,res)=>{
    res.send('red liquide is running')
})

app.listen(port,()=>{
    console.log(`bistro boss is running on ${port}`)
})