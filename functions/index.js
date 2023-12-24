const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const firestore = admin.firestore();

exports.createTicket = functions.https.onRequest((request, response) => {

    response.set('Access-Control-Allow-Origin', '*');
    response.set('Access-Control-Allow-Methods', 'GET, POST');
    response.set('Access-Control-Allow-Headers', 'Content-Type');

    
    if (request.method === 'POST') {
     
      const eventName = request.body.eventName;
  
      
      if (!eventName) {
        response.status(400).json({ error: 'Event name is required' });
        return;
      }
  
      // Generate a ticket number based on the event name and timestamp
      const ticketNumber = generateTicketNumber(eventName);

      response.status(200).json({
        message: 'Ticket created successfully',
        ticketNumber: ticketNumber,
      }); 
    } else {
      // Handle other HTTP methods
      response.status(405).send('Method Not Allowed');
    }
  });
  
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
  
