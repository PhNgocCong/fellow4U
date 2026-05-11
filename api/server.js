const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Firebase
const db = require('./config/firebase');

// Routes
const tripRoutes = require('./routes/tripRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');


// ======================
// Middleware
// ======================

app.use(cors());
app.use(express.json());


// ======================
// Firebase Test
// ======================


console.log(' Firebase Firestore đã kết nối!');


// ======================
// Routes
// ======================

app.use('/api/trips', tripRoutes);

app.use('/api/auth', authRoutes);

app.use('/api/users', userRoutes);

app.use('/api/payments', paymentRoutes);


// ======================
// Home Route
// ======================

app.get('/', (req, res) => {
    res.send('Mellow API Server is running with Firebase...');
});


// ======================
// Start Server
// ======================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(` Server đang chạy tại: http://localhost:${PORT}`);

});