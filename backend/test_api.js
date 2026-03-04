async function test() {
    try {
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: "testuser", password: "password" })
        });
        const loginData = await loginRes.json();
        console.log("Login Token:", loginData.token ? "Success" : "Failed");

        const journalRes = await fetch('http://localhost:5000/api/journals', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${loginData.token}`
            },
            body: JSON.stringify({ title: "My Title", content: "My Content" })
        });

        console.log("Journal Response Status:", journalRes.status);
        const text = await journalRes.text();
        console.log("Journal Response Body:", text);
    } catch (e) {
        console.error(e);
    }
}
test();
