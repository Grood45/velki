require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const bcrypt = require("bcrypt");

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
        const plainPassword = "Sher123";
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        const result = await usersCollection.updateOne(
            { username },
            { $set: { password: hashedPassword } }
        );

        if (result.matchedCount > 0) {
            console.log(`Password reset for user '${username}'`);
        } else {
            console.log(`User '${username}' not found. Cannot reset password.`);
        }

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
}

run();
