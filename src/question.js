const mongoose = require('mongoose');
const questionsSchema = new mongoose.Schema
    (
        {

            'Question number': {
                type: Number,
                required: false,
                trim: false
            }
            ,
            'Annotation 1': {
                type: String,
                required: false,
                trim: false
            },
            'Annotation 2': {
                type: String,
                required: false,
                trim: false
            },
            
        'Annotation 3': {
        type: String,
        required: false,
        trim: false
    },
        
            'Annotation 4': {
    type: String,
        required: false,
            trim: false
},

'Annotation 5': {
    type: String,
        required: false,
            trim: false
},
        }
);



module.exports = mongoose.model('Question', questionsSchema);