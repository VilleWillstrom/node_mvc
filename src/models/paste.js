import mongoose from "mongoose";

const pasteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    body: {
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

export default mongoose.model("Paste", pasteSchema);