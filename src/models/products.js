const mongoose = require('mongoose');
mongoose.set("useCreateIndex", true);

console.log("Defining the product schema")
const productsSchema = new mongoose.Schema({
    prodName: 
    {
        type: String,
        unique:true, 
        required: [true, 'A name for the product is needed here']
    },
    prodBrand: 
    {
        type: String, 
        unique:true, 
        required: [true, 'A name for the product is needed here']
    },
    prodPrice: 
    {
        type: Number, 
        min: 0, 
        required:[true, 'A price for the product is needed here']
    }
});
 
module.exports = new mongoose.model('productModel', productsSchema);