const express = require('express')
const cors = require('cors');
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello From Server!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xj7qmnz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('theFitnessFolk').collection('services')
        const allReviewsCollection = client.db('theFitnessFolk').collection('reviews')
        // get / read 3 services - 
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query).limit(3)
            const services = await cursor.toArray()
            res.send(services)
        })


        // get / read all services - 
        app.get('/services/all', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query)
            const services = await cursor.toArray()
            res.send(services)
        })


        // get / read a single service -
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const service = await serviceCollection.findOne(query)
            res.send(service)
        })

        // get / read a single service for review section -
        app.get('/customerreview/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const singleservice = await serviceCollection.findOne(query)
            res.send(singleservice)
        })

        // post / insert reviews - 
        app.post('/reviews', async (req, res) => {
            const review = req.body
            const result = await allReviewsCollection.insertOne(review)
            res.send(result)
        })

        // get / read reviews - 
        app.get('/reviews', async (req, res) => {
            let query = {}
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = allReviewsCollection.find(query)
            const reviews = await cursor.toArray()
            res.send(reviews)
        })
    }
    finally {

    }
}
run().catch(err => console.log(err));

app.listen(port, () => {
    console.log(`This app is running on port ${port}`)
})