const { MongoClient, ServerApiVersion } = require("mongodb");
const bcrypt = require("bcrypt");
require("dotenv").config();

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
        console.log("Connected to MongoDB");

        // NOTE: index.js hardcodes the database name to "baji"
        const db = client.db("baji");
        const usersCollection = db.collection("users");

        const username = "motheradmin";
        const plainPassword = "password123";
        const role = "mother-admin";

        const existingUser = await usersCollection.findOne({ username });

        if (existingUser) {
            console.log(`User '${username}' already exists.`);
            // Optional: Update password if you want to force reset
            // const hashedPassword = await bcrypt.hash(plainPassword, 10);
            // await usersCollection.updateOne({ username }, { $set: { password: hashedPassword } });
            // console.log(`Password reset for '${username}'`);
        } else {
            const hashedPassword = await bcrypt.hash(plainPassword, 10);
            const newUser = {
                username,
                password: hashedPassword,
                role,
                balance: 0,
                status: "activated",
                createdAt: new Date(),
            };

            const result = await usersCollection.insertOne(newUser);
            console.log(`User '${username}' created with ID: ${result.insertedId}`);
        }

    } catch (err) {
        console.error("Error creating user:", err);
    } finally {
        await client.close();
    }
}

run();
