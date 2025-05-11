const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
    formId: String,
    submissionData: Object,
    userId: String,
    syncedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Submission", submissionSchema);
