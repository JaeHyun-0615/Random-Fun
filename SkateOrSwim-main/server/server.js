const dotenv = require('dotenv').config();

const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3001;
const { fetchWeatherData } = require('./weatherDataApi');
const { estimateNetGrowth } = require('./computations');
const cors = require('cors');
app.use(cors());
app.use(express.json());

// Middleware to check API key
const apiKeyMiddleware = (req, res, next) => {
    const apiKey = req.get('x-api-key');
    if (apiKey && apiKey === process.env.BACKEND_API_KEY) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized: Invalid API key' });
    }
};


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://jsteinberg:${process.env.MONGO_PASSWORD}@skate-or-swim-0.8zapndy.mongodb.net/?retryWrites=true&w=majority`;
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
        // Send a ping to confirm a successful connection
        await client.db("final").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);

app.post('/addEntry', apiKeyMiddleware, async (req, res) => {

    try {
        await client.connect();

        const collection = client.db("skateorswim").collection("measurements");
        const entry = req.body; // This should match the structure of your documents in MongoDB


        const result = await collection.insertOne(entry);

        res.status(201).json(result);
    } catch (error) {
        console.error("Error adding entry:", error);
        res.status(500).send("Error adding entry");
    }
});

app.get('/getEntries', apiKeyMiddleware, async (req, res) => {
    try {
        await client.connect();

        const collection = client.db("skateorswim").collection("measurements");
        const entries = await collection.find({}).toArray();

        res.json(entries);
    } catch (error) {
        console.error("Error retrieving entries:", error);
        res.status(500).send("Error retrieving entries");
    }
});


// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../build')));
const router = express.Router();

// returns ice estimates for today and the next 7 days
app.get('/get-ice-thickness-estimates/:latitude/:longitude', apiKeyMiddleware, async (req, res) => {
    try {
        const { latitude, longitude } = req.params;

        const weatherData = await fetchWeatherData(latitude, longitude);

        // break up weather data into historical and future
        const now = new Date();
        const today = now.toISOString().slice(0, 10);
        const historicalWeatherData = weatherData.filter((day) => day.date < today);
        const futureWeatherData = weatherData.filter((day) => day.date >= today);

        const iceThicknessEstimates = estimateNetGrowth(historicalWeatherData, futureWeatherData);

        futureWeatherData.map((day, i) => { // add ice thickness estimates to weather data map
            day.thickness = iceThicknessEstimates[i];
        }
        );

        const allWeatherData = historicalWeatherData.concat(futureWeatherData);

        res.json(allWeatherData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


module.exports = router;


