const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");

const app = express();
const port = process.env.PORT || 7070;

// Transporter is Created
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'jindal.2002ketan@gmail.com',
        pass: 'mdpltfbfqwtlxgpg'
    }
});

// Connect to MongoDB using Mongoose
mongoose
    .connect("mongodb://0.0.0.0:27017/MyData", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });

// Enable middleware
app.use(cors());
app.use(express.json());

// Define the user model
const User = mongoose.model("User", {
    name: String,
    email: String,
    password: String,
});

// Define the OTP model
const OTP = mongoose.model("OTP", {
    email: String,
    otp: String,
});

// Create a model based on the schema
const TravData = mongoose.model("travels", {
    id: Number,
    category: String,
    title: String,
    image: String,
    description: String,
    price: Number,
    location: {
        latitude: Number,
        longitude: Number,
    },
    reviews: [
        {
            customerName: String,
            rating: Number,
            comment: String,
        },
    ],
});


// Create a Mongoose model based on the schema
const FormData = mongoose.model('FormData', {
    name: String,
    lastName: String,
    email: String,
    password: String,
    age: Number,
    gender: String,
    address: String
});

// Retrieve all documents from the "TravData" collection
app.get("/travdata", async (req, res) => {
    try {
        const data = await TravData.find();
        res.send(data);
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

app.get("/users/:email", async (req, res) => {
    try {
        const email = req.params.email;
        const user = await User.findOne({ email: email });
        if (!user) {
            res.status(404).send("No data found for the provided email.");
            return;
        }
        res.send(user);
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

app.post("/travdata/:id/reviews", async (req, res) => {
    try {
        const productId = req.params.id;
        const { rating, comment, customerName } = req.body;

        // Find the product by its ID
        const product = await TravData.findById(productId);

        if (!product) {
            res.status(404).send("Product not found");
            return;
        }

        // Create a new review object
        const review = {
            rating,
            comment,
            customerName,
        };

        // Add the review to the product's reviews array
        product.reviews.push(review);

        // Save the updated product with the new review
        const updatedProduct = await product.save();

        res.status(201).send(updatedProduct.reviews);
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

app.post("/create", async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        });
        const response = await user.save();
        res.send(response);
        // Send registration email
        sendMail(req.body.email);
    } catch (error) {
        res.status(400).send("Invalid request");
    }
});

app.post("/sendOTP/:email", async (req, res) => {
    try {
        const email = req.params.email;
        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false,
        });
        const otpMessage = `Your OTP is: ${otp}`;

        // Check if OTP exists for the email
        let otpRecord = await OTP.findOne({ email: email });

        if (otpRecord) {
            // Update the existing OTP
            otpRecord.otp = otp;
        } else {
            // Create a new OTP
            otpRecord = new OTP({
                email: email,
                otp: otp,
            });
        }

        // Save the OTP in MongoDB using Mongoose
        await otpRecord.save();

        // Send OTP email
        sendOtpEmail(email, otpMessage);

        res.send("OTP sent successfully");
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

app.post("/verifyOTP/:email/:otp", async (req, res) => {
    try {
        const email = req.params.email;
        const otp = req.params.otp;

        // Retrieve OTP from MongoDB using Mongoose
        const otpRecord = await OTP.findOne({ email: email });

        if (!otpRecord) {
            res.status(404).send("No OTP found for the provided email.");
            return;
        }

        const storedOtp = otpRecord.otp;

        if (otp === storedOtp) {
            // OTP verification successful
            res.send("OTP verification successful");
        } else {
            // Invalid OTP
            res.status(400).send("Invalid OTP");
        }
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

app.post('/form', (req, res) => {
    const formData = new FormData(req.body);

    formData.save()
        .then(() => {
            console.log('Form data saved:');
            res.sendStatus(200);
        })
        .catch((error) => {
            console.error('Error saving form data:', error);
            res.sendStatus(500);
        });
});

app.put("/forgotPass/:email", async (req, res) => {
    try {
        const email = req.params.email;
        const newPassword = req.body.newPassword;

        const result = await User.updateOne(
            { email: email },
            { $set: { password: newPassword } }
        );

        if (result.nModified === 0) {
            res.status(404).send("No data found for the provided email.");
            return;
        }

        // Send password reset email
        sendPasswordResetEmail(email);

        res.send("Password updated successfully.");
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

app.delete("/users/:email", async (req, res) => {
    try {
        const email = req.params.email;

        const result = await User.deleteOne({ email: email });

        if (result.deletedCount === 0) {
            res.status(404).send("No data found for the provided email.");
            return;
        }

        res.send("User deleted successfully.");
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

// ============================Send registration email==============================
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

// ============================Send password reset email=======================
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

// =============================Send OTP email================================
const sendOtpEmail = async (email, otpMessage) => {
    try {
        const info = await transporter.sendMail({
            from: 'jindal.2002ketan@gmail.com',
            to: email,
            subject: 'OTP Verification',
            text: otpMessage,
        });

        console.log('OTP email sent:', info.messageId);
    } catch (error) {
        console.error('Error sending OTP email:', error);
    }
};

// ===========================Start the server====================================
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});