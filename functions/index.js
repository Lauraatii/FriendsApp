const functions = require('firebase-functions');
const admin = require('firebase-admin');
// const cors = require('cors')({origin: true}); 

admin.initializeApp();

exports.createUser = functions.auth.user().onCreate((user) => {
  return admin.firestore().collection('users').doc(user.uid).set({
    email: user.email,
    // other initial fields
  });
});

// exports.updateUserName = functions.https.onRequest(async (req, res) => {
//     if (req.method !== 'POST') {
//       return res.status(405).send('Method Not Allowed');
//     }
  
//     const { userId, name } = req.body;
  
//     try {
//       await admin.firestore().collection('users').doc(userId).update({ name });
//       res.status(200).send('Name updated successfully');
//     } catch (error) {
//       console.error(error);
//       res.status(500).send('Internal Server Error');
//     }
//   });
exports.updateUserProfile = functions.https.onRequest(async (req, res) => {
    if (req.method !== 'POST') {
        console.log('Non-POST request received');
        return res.status(405).send('Method Not Allowed');
    }

    const { userId, data } = req.body;

    if (!userId || !data) {
        console.log('Invalid request body', req.body);
        return res.status(400).send('Bad Request: Missing userId or data');
    }

    try {
        const docRef = admin.firestore().collection('users').doc(userId);
        console.log(`Updating user profile for userId: ${userId} with data:`, data);

        const updateResult = await docRef.update(data);
        console.log('Update result:', updateResult);

        res.status(200).send('User profile updated successfully');
    } catch (error) {
        console.error('Update Error:', error);
        res.status(500).send(`Internal Server Error: ${error.message}`);
    }
});



