const fs = require('fs');
const path = require('path');
const user = require('../model/user');


// Configure JSON data storage
const userDataFile = path.join(__dirname, 'userDB', 'users.json');

const existingUserData = [] // assigne to an empty array
// Ensure data directory exists
fs.promises.mkdir(path.dirname(userDataFile), { recursive: true })
  .then(() => console.log('Data directory created (if needed)'))
  .catch(err => console.error('Error creating data directory:', err));


exports.loadUserDataAsObjects =  async function () {
    try {
      const userDataString = await fs.promises.readFile(userDataFile, 'utf-8');
      if(!userDataString) return existingUserData;
      const parsedUserData = JSON.parse(userDataString);
  
      
  
      // Filter out any invalid entries (if applicable)
      return parsedUserData;
    } catch (err) {
      console.error(`Error loading user data from file "${filePath}":`, err);
      throw err; // Re-throw the error for handling in the main flow
    }
  }
// Function to load user data from JSON file
exports.loadUserDataAndLookupEmail = async function (email) {
  try {
    const userData = await loadUserDataAsObjects();

    // Ensure userData is an array
    if (!Array.isArray(userData)) {
      return null; // Or handle appropriately based on requirements
    }

    // Find the user data with the matching email
    const foundUser = userData.find(user => user.email === email);

    return foundUser; // Return the found user data, or null if not found
  } catch (err) {
    console.error('Error loading or finding user data:', err);
    throw err; // Re-throw the error for handling in main flow
  }
}


// Function to save user data to JSON file
exports.saveUserData = async function (userData) {
  try {
    // Load existing user data from the file
    const existingUserData = await loadUserDataAsObjects();

    
    if (existingUserData && !Array.isArray(existingUserData)) {
      console.warn('Existing user data is not an array. Creating a new array.');
      existingUserData = [];
    }

    // Add the new user data to the existing array
    existingUserData.push(userData);

    // Format the merged data as JSON and save to file
    const data = JSON.stringify(existingUserData, null, 2); // Formatted JSON
    await fs.promises.writeFile(userDataFile, data);
  } catch (err) {
    console.error('Error saving user data:', err);
    throw err; // Re-throw the error for handling in the main flow
  }
}

