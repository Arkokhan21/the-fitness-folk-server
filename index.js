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
            const cursor = serviceCollection.find(query, { "title": 1, _id: 0 }).sort({ "title": -1 }).limit(3)
            const services = await cursor.toArray()
            res.send(services)
        })


        // get / read all services - 
        app.get('/services/all', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query, { "title": 1, _id: 0 }).sort({ "title": -1 })
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
            if (req.query.package) {
                query = {
                    package: req.query.package
                }
            }
            const cursor = allReviewsCollection.find(query)
            const reviews = await cursor.toArray()
            res.send(reviews)
        })

        // delete reviews - 
        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await allReviewsCollection.deleteOne(query)
            res.send(result)
        })

        // get / read review - (for update)
        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const review = await allReviewsCollection.findOne(query)
            res.send(review)
        })

        app.put('/reviews/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const review = req.body
            const options = { upsert: true }
            const updatedReview = {
                $set: {
                    review: review.undefined
                }
            }
            const result = await allReviewsCollection.updateOne(query, updatedReview, options)
            res.send(result);
        })

        // post / insert Services- 
        app.post('/addedservices', async (req, res) => {
            const services = req.body
            const result = await serviceCollection.insertOne(services)
            res.send(result)
        })
    }
    finally {

    }
}
run().catch(err => console.log(err));

app.listen(port, () => {
    console.log(`This app is running on port ${port}`)
})