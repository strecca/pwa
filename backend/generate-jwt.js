const jwt = require("jsonwebtoken");

// Define a secret key for signing the JWT
const SECRET_KEY = "your-secure-random-secret-key"; // Replace with your own secure key

// Define the payload for the JWT
const payload = {
    username: "admin",
    role: "admin",
};

// Define options for the JWT
const options = {
    expiresIn: "2h", // Token will expire in 2 hours
};

// Generate the JWT
const token = jwt.sign(payload, SECRET_KEY, options);

// Output the generated JWT
console.log("Generated JWT:", token);