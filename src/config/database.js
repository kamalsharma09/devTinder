const mongoose = require('mongoose');

const connectDb = async () => {
    await mongoose.connect("mongodb+srv://kamalsharma_db_user:bz87jgEsfkXeiRUc@namastenode.zlr7ctg.mongodb.net/devTinder");;
}

module.exports = connectDb;

