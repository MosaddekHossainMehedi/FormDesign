const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'StudentInfo'
});

db.connect((err) => {
    if (err) {
        console.log('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');

    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            firstname VARCHAR(100) NOT NULL,
            lastname VARCHAR(100) NOT NULL,
            department VARCHAR(50) NOT NULL,
            idno VARCHAR(50) NOT NULL UNIQUE,
            session VARCHAR(50) NOT NULL,
            semester VARCHAR(50) NOT NULL,
            bloodgroup VARCHAR(10),
            dob DATE,
            mobile_no VARCHAR(20) NOT NULL,
            email VARCHAR(150) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            presentaddress TEXT,
            permanentaddress TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    db.query(createTableQuery, (err) => {
        if (err) {
            console.log('Error creating users table:', err);
        } else {
            console.log('Users table ready');
        }
    });
});

// Create a new student profile
app.post('/addStudent', (req, res) => {
    const {
        firstname, lastname, department, idno, session, semester,
        bloodgroup, dob, mobile_no, email, password,
        presentaddress, permanentaddress
    } = req.body;

    if (!firstname || !lastname || !department || !idno || !session ||
        !semester || !mobile_no || !email || !password) {
        return res.status(400).send('Missing required fields');
    }

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.log('Error hashing password:', err);
            return res.status(500).send('Error hashing password');
        }

        const query = `INSERT INTO users
            (firstname, lastname, department, idno, session, semester, bloodgroup, dob, mobile_no, email, password, presentaddress, permanentaddress)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        db.query(query, [
            firstname, lastname, department, idno, session, semester,
            bloodgroup, dob, mobile_no, email, hash,
            presentaddress, permanentaddress
        ], (err, result) => {
            if (err) {
                console.log('Error inserting data into the database:', err);
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).send('A student with this ID No. or email already exists');
                }
                return res.status(500).send('Error inserting data into the database');
            }
            console.log('Data inserted successfully');
            res.status(200).send('Data inserted successfully');
        });
    });
});

// Fetch all student profiles (password field excluded from the response)
app.get('/getInfo', (req, res) => {
    const query = `SELECT id, firstname, lastname, department, idno, session, semester,
        bloodgroup, dob, mobile_no, email, presentaddress, permanentaddress, created_at
        FROM users`;

    db.query(query, (err, result) => {
        if (err) {
            console.log('Error fetching data from the database:', err);
            return res.status(500).send('Error fetching data from the database');
        }
        console.log('Data fetched successfully');
        res.status(200).json(result);
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
