import mysql from 'mysql'

const pool = mysql.createPool({
    host: '193.203.184.86',
    user: 'u319770579_suresopapi',
    password: 'CNZm:ds6!',
    database: 'u319770579_suresopapi'
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database!');
    connection.release(); // Release the connection back to the pool
});
export default pool;
