const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const getEmbeddings = async (tableName) => {
    // Get the absolute path to the SQLite database file
    const dbPath = "../generateEmbeddings/embeddings.db";

    // Create or open the SQLite database
    const db = new sqlite3.Database(dbPath);

    try {
        // Select all rows in the "embeddings_text_embedding_ada_002" table
        const select_rows_query = `SELECT * FROM ${tableName}`;
        const getRows = () => {
            return new Promise((resolve, reject) => {
                db.all(select_rows_query, (error, rows) => {
                    if (error) { reject(error); } else {
                        resolve(rows);
                    }
                })
            })
        }
        const rows = await getRows();

        return rows;
    } catch (error) {
        console.error('Error recuperando los embeddings:', error);
    } finally {
        // Close the database connection
        db.close();
    }
};

module.exports = {
    getEmbeddings
};