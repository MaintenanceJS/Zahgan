var mongoose = require("mongoose");

var helpSchema = new mongoose.Schema({
    name: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: ""
    },
    message: {
        type: String,
        default: ""
    }
});

module.exports = mongoose.model("query", helpSchema);;

