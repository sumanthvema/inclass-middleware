
const dotenv = require('dotenv'); 
dotenv.config(); // Add this line for the environment variables to be used
// Create express app
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserContext = require('../authentication/UserContext'); // Assuming this is your authentication class
//if the environment variable PORT is not defined, the server will run on port 3000
// this is stored and defied in the config.env file
const SECRET_KEY = process.env.SECRET_KEY; // Keep this secure

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    // Here, you should save the user to your database or data storage
    UserContext.saveUserData({ username, email, password: hashedPassword });
    res.status(201).send({ message: "User registered successfully." });
};

exports.login = async (req, res) => {

    const { email, password } = req.body;
    // Here, you should fetch the user from your database or data storage
    var usersDB = await UserContext.loadUserDataAsObjects();
    var user = usersDB.filter(user => user.email === email)[0];
    const isValidPassword = await bcrypt.compare(password, user.password);
    // Assume user.password is the hashed password
    if (isValidPassword) {
        const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '1h' });
        res.status(200).send({ token });
    } else {

        res.status(401).send({ message: "Authentication failed." });
    }
};