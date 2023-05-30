// =================================Libraries=========================
const express = require("express");
const app = express();
const cors = require('cors');
const nodemailer = require('nodemailer');
const admin = require("firebase-admin");

// ===============================Credentials===============================
const credentials = require("./key.json");
admin.initializeApp({
    credential: admin.credential.cert(credentials)
});
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'jindal.2002ketan@gmail.com',
        pass: 'mdpltfbfqwtlxgpg'
    }
});
// ========================App Binding & Firestore=======================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const db = admin.firestore();

// ========================== Get all users================================
app.get('/users', async (req, res) => {
    try {
        const users = await db.collection("users").get();
        const response = users.docs.map(user => user.data());
        res.send(response);
    } catch (error) {
        res.status(500).send(error);
    }
});

// ==============================Get user by email===========================
app.get('/users/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const user = await db.collection("users").where("email", "==", email).get();
        if (user.empty) {
            res.status(404).send('No data found for the provided email.');
            return;
        }
        const response = user.docs.map(doc => doc.data());
        res.send(response);
    } catch (error) {
        res.status(500).send(error);
    }
});

// ==============================Create user================================
app.post('/create', async (req, res) => {
    try {
        const id = req.body.email;
        const userJson = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        };
        const response = await db.collection("users").doc(id).set(userJson);
        res.send(response);

        // Send registration email
        sendMail(req.body.email);
    }
    catch (error) {
        res.status(404).send(error);
    }
});

app.put('/forgotPass/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const newPassword = req.body.newPassword;
        const userRef = db.collection("users").doc(email);
        const user = await userRef.get();

        if (!user.exists) {
            res.status(404).send('No data found for the provided email.');
            return;
        }

        await userRef.update({ password: newPassword });

        // Send password reset email
        sendPasswordResetEmail(email);

        res.send('Password updated successfully.');
    } catch (error) {
        res.status(500).send(error);
    }
});

// Delete user by email
app.delete('/users/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const userRef = db.collection("users").doc(email);
        const user = await userRef.get();
        if (!user.exists) {
            res.status(404).send('No data found for the provided email.');
            return;
        }

        await userRef.delete();

        res.send('User deleted successfully.');
    } catch (error) {
        res.status(500).send(error);
    }
});

// Send registration email
const sendMail = async (email) => {
    try {
        const info = await transporter.sendMail({
            from: 'jindal.2002ketan@gmail.com',
            to: email,
            subject: 'Registration Confirmation',
            text: 'Thank you for registering with TravelGenix. Your account has been successfully created.'
        });

        console.log('Registration email sent:', info.messageId);
    } catch (error) {
        console.error('Error sending registration email:', error);
    }
};

// Send password reset email
const sendPasswordResetEmail = async (email) => {
    try {
        const info = await transporter.sendMail({
            from: 'jindal.2002ketan@gmail.com',
            to: email,
            subject: 'Password Reset',
            text: 'Your password has been successfully reset. If you did not request this change, please contact our support team immediately.'
        });

        console.log('Password reset email sent:', info.messageId);
    } catch (error) {
        console.error('Error sending password reset email:', error);
    }
};
const PORT = process.env.PORT || 6060;
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}.`);
});