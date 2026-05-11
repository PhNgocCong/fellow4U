const db = require('../config/firebase');

const tripsCollection = db.collection('trips');


// ======================
// GET ALL TRIPS
// ======================

exports.getAllTrips = async (req, res) => {

    try {

        const snapshot = await tripsCollection
            .orderBy('createdAt', 'desc')
            .get();

        const trips = [];

        snapshot.forEach(doc => {

            trips.push({
                id: doc.id,
                ...doc.data()
            });

        });

        res.status(200).json(trips);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};


// ======================
// CREATE TRIP
// ======================

exports.createTrip = async (req, res) => {

    try {

        const data = {
            ...req.body,
            status: req.body.status || 'pending',
            createdAt: new Date(),
        };

        const docRef = await tripsCollection.add(data);

        res.status(201).json({
            id: docRef.id,
            ...data
        });

    } catch (err) {

        res.status(400).json({
            message: "Lỗi tạo chuyến đi: " + err.message
        });

    }

};


// ======================
// GET TRIP BY ID
// ======================

exports.getTripById = async (req, res) => {

    try {

        const doc = await tripsCollection
            .doc(req.params.id)
            .get();

        if (!doc.exists) {

            return res.status(404).json({
                message: "Không tìm thấy chuyến đi"
            });

        }

        res.status(200).json({
            id: doc.id,
            ...doc.data()
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};


// ======================
// MARK FINISHED
// ======================

exports.markFinished = async (req, res) => {

    try {

        await tripsCollection
            .doc(req.params.id)
            .update({
                status: 'finished'
            });

        const updatedDoc = await tripsCollection
            .doc(req.params.id)
            .get();

        res.status(200).json({
            id: updatedDoc.id,
            ...updatedDoc.data()
        });

    } catch (err) {

        res.status(400).json({
            message: err.message
        });

    }

};


// ======================
// DELETE ALL TRIPS
// ======================

exports.deleteAllTrips = async (req, res) => {

    try {

        const snapshot = await tripsCollection.get();

        const batch = db.batch();

        snapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });

        await batch.commit();

        res.status(200).json({
            success: true,
            message: "Đã xóa toàn bộ chuyến đi thành công!"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Lỗi khi xóa dữ liệu",
            error: error.message
        });

    }

};


// ======================
// DELETE ONE TRIP
// ======================

exports.deleteTrip = async (req, res) => {

    try {

        const { id } = req.params;

        const doc = await tripsCollection
            .doc(id)
            .get();

        if (!doc.exists) {

            return res.status(404).json({
                success: false,
                message: "Không tìm thấy trip để xóa"
            });

        }

        await tripsCollection
            .doc(id)
            .delete();

        res.status(200).json({
            success: true,
            message: "Đã xóa trip thành công!"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

};