const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();


const app = express();
const port = 5000;


//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fiuyj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const db = client.db('traveloop');
        const collection = db.collection('events');
        const orders = db.collection('orders');

        //get api
        app.get('/events', async (req, res) => {
            const cursor = collection.find({});
            const events = await cursor.toArray();
            console.log(events)
            res.send(events);
        });

        app.get('/events/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const event = await collection.findOne(query);
            res.send(event);
        });
        app.get('/orders/:id', async (req, res) => {
            const query = { email: req.params.id }
            const data = await orders.find(query).toArray();
            console.log(data, req.params.id)
            res.send(data);
        });

        //post api
        app.post('/events', async (req, res) => {
            const event = req.body;
            const result = await collection.insertOne(event);
            res.json(result)
        });
        app.post('/place_order', async (req, res) => {
            const order = req.body;
            console.log(order)
            const result = await orders.insertOne(order);
            res.json(result)
        });

        //delete api
        app.delete('/events/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await collection.deleteOne(query);
            res.send(result);
        })

    } finally {
        //
    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('running car')
});

app.listen(port, () => {
    console.log('running on port ', port);
});