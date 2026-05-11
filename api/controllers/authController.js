const db = require('../config/firebase');

const usersCollection = db.collection('users');


// ======================
// CHANGE PASSWORD
// ======================

exports.changePassword = async (req, res) => {

    const {
        userId,
        currentPassword,
        newPassword
    } = req.body;

    try {

        const doc = await usersCollection
            .doc(userId)
            .get();

        // CHECK USER
        if (!doc.exists) {

            return res.status(404).json({
                message: "Người dùng không tồn tại"
            });

        }

        const user = doc.data();

        // CHECK CURRENT PASSWORD
        if (user.password !== currentPassword) {

            return res.status(400).json({
                message: "Mật khẩu hiện tại không đúng"
            });

        }

        // UPDATE PASSWORD
        await usersCollection
            .doc(userId)
            .update({
                password: newPassword
            });

        res.status(200).json({
            message: "Đổi mật khẩu thành công!"
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};