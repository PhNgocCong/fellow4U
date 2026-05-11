const db = require('../config/firebase');

const paymentsCollection = db.collection('payments');
const tripsCollection = db.collection('trips');


// ======================
// PROCESS PAYMENT
// ======================

exports.processPayment = async (req, res) => {

    try {

        const {
            userId,
            tripId,
            cardHolderName,
            cardNumber,
            expiryDate,
            amount
        } = req.body;

        // VALIDATE
        if (!cardHolderName || !cardNumber || !expiryDate || !amount) {

            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin thanh toán'
            });

        }

        // CREATE PAYMENT DATA
        const paymentData = {

            userId: userId || null,

            tripId: tripId || null,

            cardHolderName,

            cardNumber,

            expiryDate,

            amount,

            status: 'completed',

            createdAt: new Date()

        };

        // SAVE PAYMENT
        const docRef = await paymentsCollection
            .add(paymentData);

        // UPDATE TRIP STATUS (SAFE)
        if (tripId) {

            const tripDoc = await tripsCollection
                .doc(tripId)
                .get();

            if (tripDoc.exists) {

                await tripsCollection
                    .doc(tripId)
                    .update({
                        status: 'paid'
                    });

            }

        }

        // SUCCESS RESPONSE
        return res.status(201).json({

            success: true,

            message: "Thanh toán thành công!",

            payment: {
                id: docRef.id,
                ...paymentData
            }

        });

    } catch (err) {

        console.error("PAYMENT ERROR:", err);

        return res.status(500).json({

            success: false,

            message: "Lỗi thanh toán",

            error: err.message

        });

    }

};


// ======================
// GET PAYMENT HISTORY
// ======================

exports.getPaymentHistory = async (req, res) => {

    try {

        const { userId } = req.params;

        let query = paymentsCollection;

        // FILTER BY USER
        if (userId) {

            query = query.where(
                'userId',
                '==',
                userId
            );

        }

        const snapshot = await query
            .orderBy('createdAt', 'desc')
            .get();

        const payments = [];

        snapshot.forEach(doc => {

            payments.push({

                id: doc.id,

                ...doc.data()

            });

        });

        return res.status(200).json(payments);

    } catch (err) {

        console.error("GET PAYMENT HISTORY ERROR:", err);

        return res.status(500).json({

            success: false,

            message: "Lỗi lấy lịch sử",

            error: err.message

        });

    }

};