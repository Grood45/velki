const fetch = require("node-fetch");

async function testLogin() {
    try {
        const res = await fetch("http://localhost:5001/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: "motheradmin", password: "Sher123" }) // using correct username and password
        });
        const loginData = await res.json();
        console.log("Login res:", res.status, loginData);

        if (loginData.token) {
            const profileRes = await fetch("http://localhost:5001/users/profile", {
                headers: { Authorization: `Bearer ${loginData.token}` }
            });
            const profileData = await profileRes.json();
            console.log("Profile res:", profileRes.status, profileData);
        }
    } catch (e) {
        console.error(e);
    }
}

testLogin();
