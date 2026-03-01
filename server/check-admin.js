require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.DB_URI;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        await client.connect();
        const db = client.db("baji");
        const usersCollection = db.collection("users");

        const existingAdmins = await usersCollection.find({ role: "admin" }).toArray();
        console.log("Admin details:", existingAdmins);

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
}

run();
