const db = require('../config/firebase');

const usersCollection = db.collection('users');


// ======================
// UPDATE PROFILE
// ======================

exports.updateProfile = async (req, res) => {

    try {

        const userId = req.params.id;

        const updateData = {
            firstName: req.body.firstName
                ? req.body.firstName.trim()
                : "",

            lastName: req.body.lastName
                ? req.body.lastName.trim()
                : "",

            avatarUrl: req.body.avatarUrl || ""
        };

        await usersCollection
            .doc(userId)
            .update(updateData);

        const updatedDoc = await usersCollection
            .doc(userId)
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
// GET PROFILE
// ======================

exports.getProfile = async (req, res) => {

    try {

        const userId =
            req.query.userId ||
            (req.body ? req.body.userId : null);

        // GET ALL USERS
        if (!userId) {

            const snapshot = await usersCollection
                .orderBy('createdAt', 'desc')
                .get();

            const allUsers = [];

            snapshot.forEach(doc => {

                allUsers.push({
                    id: doc.id,
                    ...doc.data()
                });

            });

            return res.status(200).json({
                message: "Success",
                users: allUsers
            });

        }

        // GET ONE USER
        const doc = await usersCollection
            .doc(userId)
            .get();

        if (!doc.exists) {

            return res.status(404).json({
                message: "Không tìm thấy user"
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
// ADD PHOTOS
// ======================

exports.addPhotos = async (req, res) => {

    try {

        const userId =
            req.body.userId || req.params.id;

        const doc = await usersCollection
            .doc(userId)
            .get();

        if (!doc.exists) {

            return res.status(404).json({
                message: "User không tồn tại"
            });

        }

        const userData = doc.data();

        const currentPhotos = userData.photos || [];

        const newPhotos = req.body.photos || [];

        const updatedPhotos = [
            ...currentPhotos,
            ...newPhotos
        ];

        await usersCollection
            .doc(userId)
            .update({
                photos: updatedPhotos
            });

        res.status(200).json(updatedPhotos);

    } catch (err) {

        res.status(400).json({
            message: err.message
        });

    }

};


// ======================
// GET PHOTOS
// ======================

exports.getPhotos = async (req, res) => {

    try {

        const userId =
            req.params.id || req.query.userId;

        const doc = await usersCollection
            .doc(userId)
            .get();

        if (!doc.exists) {

            return res.status(404).json({
                message: "User không tồn tại"
            });

        }

        const userData = doc.data();

        res.status(200).json(
            userData.photos || []
        );

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};


// ======================
// CREATE USER
// ======================

exports.createUser = async (req, res) => {

    try {

        const newUser = {

            firstName:
                req.body.firstName || "New",

            lastName:
                req.body.lastName || "User",

            avatarUrl:
                req.body.avatarUrl || "",

            password:
                req.body.password || '123456',

            photos: [],

            createdAt: new Date()

        };

        const docRef = await usersCollection
            .add(newUser);

        res.status(201).json({
            id: docRef.id,
            ...newUser
        });

    } catch (err) {

        res.status(400).json({
            message: err.message
        });

    }

};


// ======================
// CHANGE PASSWORD
// ======================

exports.changePassword = async (req, res) => {

    try {

        const userId = req.params.id;

        const {
            oldPassword,
            newPassword
        } = req.body;

        const doc = await usersCollection
            .doc(userId)
            .get();

        if (!doc.exists) {

            return res.status(404).json({
                message: "Không tìm thấy người dùng"
            });

        }

        const user = doc.data();

        // CHECK OLD PASSWORD
        if (user.password !== oldPassword) {

            return res.status(400).json({
                message: "Mật khẩu hiện tại không chính xác"
            });

        }

        // UPDATE PASSWORD
        await usersCollection
            .doc(userId)
            .update({
                password: newPassword
            });

        res.status(200).json({
            message: "Đổi mật khẩu thành công"
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};