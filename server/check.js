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

        const username = "motheradmin";
        const existingUser = await usersCollection.findOne({ username });
        console.log("MotherAdmin details:", existingUser);

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
}

run();
