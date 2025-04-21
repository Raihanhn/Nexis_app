const express = require("express");
const mysql = require('mysql');
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const moment = require('moment-timezone');
const crypto = require("crypto");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Define the path for storing uploaded files
const uploadPath = path.join(__dirname, "uploads"); // Adjust this based on your cPanel setup

// Ensure the uploads folder exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });



// Set up MySQL connection (Main database)
const db = mysql.createPool({
  host: "localhost",
  user: "saas",
  password: "Bangladesh$$786",
  database: "saas",
   connectionLimit: 10,
});

// Home route for the welcome message
app.get("/", (req, res) => {
  res.send("<h1>Welcome to the SAAS Home Page</h1>");
});

// API route to save user IP address
app.post('/api/save-ip', (req, res) => {
  const { email, ip } = req.body;

  // Get current date and time in Australia/Sydney timezone
  const currentTimestamp = moment().tz('Australia/Sydney').unix();

  const updateQuery = `
    UPDATE uerp_user 
    SET ip = ?, date = ?
    WHERE email = ?
  `;
  
  db.query(updateQuery, [ip, currentTimestamp, email], (error, result) => {
    if (error) {
      console.error('Error saving IP address:', error);
      return res.status(500).json({ error: 'Failed to save IP address' });
    }

    res.json({ message: 'IP address saved successfully!' });
  });
});

// Function to retrieve user details from user-specific database
const getUserDetails = (ref_db, userId, callback) => {
  const userDbConnection = mysql.createPool({
    host: 'localhost',
    user: 'saas',
    password: 'Bangladesh$$786',
    database: ref_db,
  });

  const query = `SELECT id, ip, date, username2, images FROM uerp_user WHERE id = ?`;
  userDbConnection.query(query, [userId], (error, results) => {
    userDbConnection.end(); // Close the connection
    if (error) {
      return callback(error, null);
    }
    callback(null, results.length > 0 ? results[0] : null); // Return the user details if found
  });
};


// Function to hash with MD5
const hashMD5 = (password) => {
  return crypto.createHash("md5").update(password).digest("hex");
};


// Login route with bcrypt + MD5 check
app.post("/api/signin", (req, res) => {
  const { unbox, passbox } = req.body;

  if (!unbox || !passbox) {
    return res.status(400).json({ message: "Unbox and password are required." });
  }

  const queryMainDB = "SELECT id, unbox, ref_db, passbox FROM uerp_user WHERE unbox = ?";
  db.query(queryMainDB, [unbox], async (err, mainResult) => {
    if (err) {
      console.error("Main database error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (mainResult.length === 0) {
      return res.status(401).json({ message: "Invalid unbox or password in main database." });
    }

    const { id, unbox: mainUnbox, ref_db, passbox: mainHashedPassword } = mainResult[0];
    

    // Check bcrypt first
    let isPasswordValid = await bcrypt.compare(passbox, mainHashedPassword);

    // If bcrypt fails, check MD5
    if (!isPasswordValid) {
      isPasswordValid = mainHashedPassword === hashMD5(passbox);
    }

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid unbox or password in main database." });
    }

    console.log("Main database authentication successful:", { id, mainUnbox, ref_db });

    // Connect to the database specified by ref_db
    const secondaryDB = mysql.createPool({
      host: "localhost",
      user: "saas",
      password: "Bangladesh$$786",
      database: ref_db,
      connectionLimit: 10,
    });

    const querySecondaryDB = "SELECT id, unbox, username, username2, email, phone, passbox FROM uerp_user WHERE unbox = ?";
    secondaryDB.query(querySecondaryDB, [unbox], async (err, secondaryResult) => {
      if (err) {
        console.error("Secondary database error:", err);
        return res.status(500).json({ message: "Error connecting to secondary database." });
      }

      if (secondaryResult.length === 0) {
        return res.status(401).json({ message: "Invalid unbox or password in secondary database." });
      }

      const { id: secondaryId, unbox: secondaryUnbox, username, username2, email, phone, passbox: secondaryHashedPassword } =
        secondaryResult[0];

      // Check bcrypt first
      let isSecondaryPasswordValid = await bcrypt.compare(passbox, secondaryHashedPassword);

      // If bcrypt fails, check MD5
      if (!isSecondaryPasswordValid) {
        isSecondaryPasswordValid = secondaryHashedPassword === hashMD5(passbox);
      }

      if (!isSecondaryPasswordValid) {
        return res.status(401).json({ message: "Invalid unbox or password in secondary database." });
      }

      console.log("Secondary database authentication successful:", {
        secondaryId,
        secondaryUnbox,
        username,
        username2,
        email,
        phone,
      });

      return res.status(200).json({
        saas: { id, unbox: mainUnbox, ref_db },
        secondary: { id: secondaryId, unbox: secondaryUnbox, username, username2, email, phone },
      });
    });
  });
});



// Define the connectToDatabase function
const connectToDatabase = (ref_db) => {
  return new Promise((resolve, reject) => {
    const dbConnection = mysql.createPool({
      host: 'localhost',
      user: 'saas',
      password: 'Bangladesh$$786',
      database: ref_db,
    });

    // Test the connection
    dbConnection.getConnection((err, connection) => {
      if (err) {
        reject(err); 
      } else {
        resolve(dbConnection); 
      }
    });
  });
};


app.post("/api/insert-incident", upload.single('document'), async (req, res) => {
  const { ref_db, userid, date, clientid, person, incident, witness1, dob1, address1, phone1, witness2, dob2, address2, phone2, incidentdate, timeofincident, happend, incidentperform, type,
    other, type1, other1, type2, other2, type3, other3, suggestion, firstaid, status } = req.body;

  if (!ref_db || !userid) {
    return res.status(400).json({ success: false, message: "ref_db and userid are required" });
  }

  try {
    const dbConnection = await connectToDatabase(ref_db);
    
    const referredValue = `${type3 || ""} - ${other3 || ""}`;

    // Handle file upload
    let filePath = null;
    if (req.file) {
      filePath = path.join(uploadPath, req.file.filename);
    }

    // Insert data into the incident table with file path
    const query = `INSERT INTO incident (employeeid, date, clientid, upload, involved, location, witness1, dob1, address1, phone1, witness2, dob2, address2, phone2, incidentdate, hourminute, what_happened,
        what_performed, injury, other_injury, area, other_area, treatment, treatment_other, referred, suggestion, firstaid, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;  

    const values = [userid, date, clientid, filePath, person, incident, witness1, dob1, address1, phone1, witness2, dob2, address2, phone2, incidentdate, timeofincident, happend, incidentperform, type,
    other, type1, other1, type2, other2, referredValue, suggestion, firstaid, status];  

    dbConnection.query(query, values, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ success: false, message: "Database error" });
      }

      res.json({ success: true, message: "Incident record inserted successfully", data: results });
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.post("/api/leads-form", upload.single('document'), async (req, res) => {
  const { ref_db, userid, leadName, campaignid, title, firstName, surName, preferredName, gender, dob, address, city, state, zip, country, email, phone, billingAddress, clientStory,
    note, managerid, addemail, addphone, type, priority, ndis, followUpDate, appointmentDate, targetDate, status } = req.body;

  if (!ref_db || !userid) {
    return res.status(400).json({ success: false, message: "ref_db and userid are required" });
  }

  try {
    const dbConnection = await connectToDatabase(ref_db);
    // Handle file upload
    let filePath = null;
    if (req.file) {
      filePath = path.join(uploadPath, req.file.filename);
    }
    // Insert data into the incident table with file path
    const query = `INSERT INTO leads (employeeid, upload, lead_name, campaignid, title, name, surname, preferred_name, gender, cdob, address, ccity, cstate, czip, ccountry, email, phone, billing_address, note,
        note_for_staff, case_manager, remail, rphone, rtype, priority, ndis_no, followup_date, appointment_date, target_date, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;  

    const values = [userid, filePath, leadName, campaignid, title, firstName, surName, preferredName, gender, dob, address, city, state, zip, country, email, phone, billingAddress, clientStory, note, managerid, addemail, addphone, type, priority, ndis, followUpDate, appointmentDate, targetDate, status];  

    dbConnection.query(query, values, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ success: false, message: "Database error" });
      }

      res.json({ success: true, message: "Incident record inserted successfully", data: results });
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

