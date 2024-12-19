// server/src/services/airtableService.js
const axios = require('axios');
const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } = require('../config/config');

const airtable = axios.create({
  baseURL: `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`,
  headers: {
    Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

async function findUserByEmail(email) {
  const filter = encodeURIComponent(`{Email} = '${email}'`);
  const response = await airtable.get(`/Users?filterByFormula=${filter}`);
  return response.data.records[0]; 
}

async function createUser(fields) {
  const response = await airtable.post('/Users', {
    records: [{ fields }]
  });
  return response.data.records[0];
}

module.exports = { findUserByEmail, createUser };
