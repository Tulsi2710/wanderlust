const mongoose = require("mongoose");
const initdata = require("./data");
const listing = require("../models/listing.js");

main().then(()=> {
    console.log("connected to DB");
}). catch((err)=> {
    console.log(err);
})

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};

const initDB = async () => {
    await listing.deleteMany({});
    initdata.data=  initdata.data.map((obj)=> ({...obj, owner: "696e1faf7173362da2869369"}));
    await listing.insertMany(initdata.data);
    console.log("data initialised");
};

initDB();
