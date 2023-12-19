const express = require('express');
const cors = require('cors')
require('dotenv').config()
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port =  3000;

app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))




// bbbb


const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.kvtrj3x.mongodb.net/?retryWrites=true&w=majority`;

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
        const database = client.db('Product');
        const appointmentOptionCollection = database.collection('ProductAll');
        const bookingCollection = database.collection('bookings');
        const usersCollection = database.collection('Users');
        

        app.get("/ProductAll", async (req,res)=>{
            

            const query = {};
            const options = await appointmentOptionCollection.find(query).toArray();
            res.send(options)
        });
        

       

        app.post('/ProductAll', async (req, res) => {
          const name = req.body.name;
          const seller= req.body.seller;
          const phone = req.body.phone;
          const category = req.body.category;
          const price= req.body.price;
          const stock= req.body.stock;
          const ratings= req.body.ratings;
          

          const pic = req.files.img;
          const picData = pic.data;
          const encodedPic = picData.toString('base64');
          const imageBuffer = Buffer.from(encodedPic, 'base64');

          const postadd = {
              name,
             seller,
              phone,
              category,
              price,
              stock,
              ratings,
              img: imageBuffer
          }
          const result = await appointmentOptionCollection.insertOne(postadd);
          res.send(result)
      })
        app.get('/bookings', async (req, res) => {
          const email = req.query.email;
          
          const query = { email: email };
          const bookings = await bookingCollection.find(query).toArray();
          res.send(bookings)
      })
        app.get('/bookings/:id', async (req, res) => {
          const id = req.params.id;
          
          const query = {_id: new ObjectId(id)};
          const booking = await bookingCollection.findOne(query);
          res.send(booking);
      })

        app.post('/bookings', async (req, res) => {
          const booking = req.body;
          
          const result = await bookingCollection.insertOne(booking);
          res.send(result)
      })

        app.delete('/bookings/:id', async (req, res) => {

          const id = req.params;
    // console.log(id);
          const query = {_id: new ObjectId(id)};
          const result = await bookingCollection.deleteOne(query);
          res.send(result);
      })


      app.get('/users', async (req, res) => {
        const query = {};
        const result = await usersCollection.find(query).toArray();
        res.send(result)
    })

   


      app.post('/users', async (req, res) => {
        const user = req.body;
        const result = await usersCollection.insertOne(user);
        res.send(result)
    })


    app.put('/users/admin/:id', async (req, res) => {
      const id = req.params.id;
      
      const filter = { _id: new ObjectId(id) };
      const option = { upset: true };
      const updatedDoc = {
          $set: {
              role: 'admin'
          }
      }
      const result = await usersCollection.updateOne(filter, updatedDoc, option);
      res.send(result)
  })



  app.delete('/users/:id', async(req, res)=>{
    const id = req.params;
    // console.log(id);
    const query = {_id: new ObjectId(id)};
    const result = await usersCollection.deleteOne(query);
    res.send(result);
  })

  app.get('/users/admin/:email', async (req, res) => {
    const email = req.params.email;
    // console.log(email);
    const query = { email };
    const user = await usersCollection.findOne(query);
    res.send({ isAdmin: user?.role === 'admin' });

})


  } finally {
    
    // await client.close();
  }
}
run().catch(console.dir);

// bbbb




app.get('/', (req, res) => {
    res.send('Product is Runing');
})

app.listen(port, () => {
    console.log(`Our Doctors website run on Port http://localhost:${port}`)
})