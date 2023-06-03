const mongoose = require('mongoose');
const topicsSchema = new mongoose.Schema
    (
        {
            
            'Topic Level 1': {
        type: String,
        required: false,
        trim: false
    }
,
            'Topic Level 2': {
                type: String,
                required: false,
                trim: false
            },
            'Topic Level 3': {
                type: String,
                required: false,
                trim: false
            },
        }
);
module.exports = mongoose.model('Topics', topicsSchema);
