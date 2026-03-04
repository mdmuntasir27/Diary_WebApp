const pool = require('./database');

async function testInsert() {
    try {
        console.log("Adding journal...");
        const newJournal = await pool.query(
            'INSERT INTO journals (user_id, title, content) VALUES (?, ?, ?)',
            [1, "Test Title", "Test Content"]
        );
        console.log("Journal added:", newJournal);

        const result = await pool.query('SELECT * FROM journals WHERE id = ?', [newJournal.rows[0].id]);
        console.log("Fetched Back:", result.rows[0]);
    } catch (err) {
        console.error("Error inserting:", err.message);
    }
}

testInsert();
