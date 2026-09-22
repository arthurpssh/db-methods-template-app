// src/services/userService.js
const SheetsDB = require('../utils/SheetsDB');

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAME = 'users'; // Replace with your exact sheet (tab) name

/**
 * Fetches all users or filters based on a query
 * Example filters: { status: 'Active', department: 'Sales' }
 */
async function getUsers(filters = {}) {
  const users = await SheetsDB.getRows(SPREADSHEET_ID, SHEET_NAME, filters);
  return users;
}

async function getUserById(id) {
  // We pass the id as an exact query to the SheetsDB utility
  const results = await SheetsDB.getRows(SPREADSHEET_ID, SHEET_NAME, { id });
  
  // Since getRows returns an array, we return the first item (if it exists)
  return results.length > 0 ? results[0] : null;
}

/**
 * Fetches a single user (using email as "ID", for example)
 */
async function getUserByEmail(email) {
  // We pass the email as an exact query
  const results = await SheetsDB.getRows(SPREADSHEET_ID, SHEET_NAME, { email });
  
  // Since getRows returns an array, we return the first item (if it exists)
  return results.length > 0 ? results[0] : null;
}

/**
 * Inserts a new user into the sheet
 */
async function createUser(userData) {
  // Here you can add business rules before saving.
  // Example: check if the email already exists, generate a creation date, etc.
  userData.id = new Date().getTime()
  userData.created_at = new Date().toISOString();
  
  await SheetsDB.postRows(SPREADSHEET_ID, SHEET_NAME, userData);
  
  return userData;
}

/**
 * Updates an existing user
 * Example query: { email: 'john@email.com' }
 * Example updateData: { department: 'Marketing', status: 'Inactive' }
 */
async function updateUser(id, updateData) {
  const affectedRows = await SheetsDB.patchRows(
    SPREADSHEET_ID, 
    SHEET_NAME, 
    { id }, // Filter for who will be updated
    updateData // The data to update
  );

  return affectedRows > 0; // Returns true if any row was updated
}

/**
 * Deletes a user
 */
async function deleteUser(id) {
  console.log('deleting user ' + id)
  await SheetsDB.deleteRows(SPREADSHEET_ID, SHEET_NAME, { id });
  return true; 
}

module.exports = {
  getUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser
};