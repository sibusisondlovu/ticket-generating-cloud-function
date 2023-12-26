const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const firestore = admin.firestore();

exports.createTicket = functions.https.onRequest((request, response) => {

    response.set('Access-Control-Allow-Origin', '*');
    response.set('Access-Control-Allow-Methods', 'GET, POST');
    response.set('Access-Control-Allow-Headers', 'Content-Type');


    if (request.method === 'POST') {

        const tickets =  JSON.parse(request.body.tickets);

        if (!tickets) {
            response.status(400).json({ error: 'Ticket list is required' });
            return;
        }

        // Generate a ticket number based on the event name and timestamp
       const ticketNumber = generateTicketNumber(tickets[0].name);

        // Generate a transaction number
        const transactionNumber = generateTransactionNumber();

        // Get current date and time
        const { date, time } = getCurrentDateTime();

         const transaction = {
             transactionNumber: transactionNumber,
             dateOfTransaction: date,
             timeOfTransaction: time,
        };

        response.status(200).json({
            message: 'success',
            transaction: ticketNumber,
        });
    } else {
        // Handle other HTTP methods
        response.status(405).send('Method Not Allowed');
    }
});

// Function to get the current date and time in the desired formats
function getCurrentDateTime() {
    const now = new Date();
    const date = now.toISOString().slice(0, 10); // Date in YYYY-MM-DD format
    const time = now.toLocaleTimeString('en-US', { hour12: false }); // Time in 24-hour format
    return { date, time };
  }

// Function to generate a unique 10-digit transaction number
function generateTransactionNumber() {
    const timestamp = Date.now().toString().slice(-10);
    const randomDigits = Math.floor(Math.random() * 100000000);
    return timestamp + randomDigits.toString().padStart(8, '0');
}

// Function to generate a ticket number based on event name and timestamp
function generateTicketNumber(eventName) {
    // Extracting the first letters of the event name
    const initials = eventName
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase();

    // Generating a unique 8-digit number based on timestamp
    const timestamp = Date.now().toString().slice(-8);

    const ticketNumber = `${initials}${timestamp}TBP`;
    return ticketNumber;
}

