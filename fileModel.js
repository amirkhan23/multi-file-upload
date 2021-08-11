const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
    originalname: {
        type: String
    },
    mimetype: {
        type: String
    },
    path: {
        type: String
    },
    filename: {
        type: String
    }
}, { timestamps: true });

module.exports = FileModel = mongoose.model("Files", FileSchema);