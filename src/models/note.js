import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
   
}, { timestamps: true });

/*
{
    title: 'otsikko',
    description: 'kuvaus',
    body: 'tekstisisältöä'
}
*/

export default mongoose.model("Note", noteSchema);