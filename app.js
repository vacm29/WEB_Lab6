const express = require('express');
const app = express();
app.use(express.json()); // body-parser
const ejs = require('ejs');

require('./src/database');
let productModel = require('./src/models/products');
//let userModel = require('./src/models/users');


//MONGOOOSE -Usuario----------------------

//Mongoose END Usuario----------------------

//MONGOOSE - Products
app.route('/products/create').get((req, res) =>{
    res.sendFile('add.html', {root: './src/pages/'});
});

app.route('/products/create').post((req, res) =>{
    let{ prodName, prodBrand, prodPrice } = req.body; // JS object deconstruction
    
    let product = new productModel({prodName: prodName, prodBrand: prodBrand, prodPrice: prodPrice});
    product.save((err) => {
        if (err) res.status(503).send(`error: ${err}`); 
        else res.send(product);
    });
});

app.route('/products/all').get((req, res) => {
    res.sendFile('productList.html', {root: './src/pages'});
});

app.route('/products').get(async (req, res) => {
    let allMovies = await productModel.find();
    res.send(allMovies);
});

app.route('/products/:id').get(async (req, res) => {
    let productId  = req.params.id;
    let product = await productModel.findOne({_id: productId});
    if (product)
        res.send(product);
    else
        res.status(404).end(`product with id ${productId} does not exist`)
});

app.route('/products/:id').put((req, res) => {
    let productId  = req.params.id;
    let{ prodName, prodBrand, prodPrice } = req.body;
    productModel.findOneAndUpdate(
        {_id: productId}, // selection criteria
        {
            prodName: prodName,
            prodBrand: prodBrand,
            prodPrice: prodPrice
        }
    )
    .then(product => res.send(product))
    .catch(err => { console.log(error); res.status(503).end(`Could not update product ${error}`); });
});

app.route('/products/:id').delete((req, res) => {
    let prodId  = req.params.id;
    productModel.findOneAndDelete({_id: prodId})
    .then(product => res.send(product))
    .catch(err => { console.log(error); res.status(503).end(`Could not delete product ${error}`); });
});

app.route('/products/:id/edit').get((req, res) => {
    let prodId  = req.params.id;

    // load the product as string, leaver some markers and replace the markers with the info you need
    // create the page from scratch dynamically

    ejs.renderFile('./src/pages/editProd.html', {prodId: prodId}, null, function(err, str){
        if (err) res.status(503).send(`error when rendering the view: ${err}`); 
        else {
            res.end(str);
        }
    });
});

app.route('/products/insert/insertMany/').get((req, res) => {
     //First products<
     let product = new productModel({prodName: "Dozena de Huevos", prodBrand: "Granja Gold", prodPrice: 30.00});
     product.save((err) => {
         if (err) res.status(503).send(`error: ${err}`); 
     });
     product = new productModel({prodName: "Manzana", prodBrand: "Arboles", prodPrice: 10.00});
     product.save((err) => {
         if (err) res.status(503).send(`error: ${err}`); 
     });
     product = new productModel({prodName: "Kilo de Frijoles", prodBrand: "Mighty", prodPrice: 40.00});
     product.save((err) => {
         if (err) res.status(503).send(`error: ${err}`); 
     });
     res.send('done');
     //>
});
//MOGOOS END Products-----------------------------------------------

//MONGOOSE Store----------------------------------------------------

app.get('/store/buy', (req, res) => {
    res.sendFile("./src/pages/buy.html", {root: __dirname});   
});
//MONGOOSE END  Store-----------------------------------------------

//Main Page----------------------------------------------------------
app.get('/', (req, res) => {
    res.sendFile("./src/pages/store-front.html", {root: __dirname});   
});


const portNumber = 3000;
var server = app.listen(portNumber, function(){
    console.log('Express Server ready and running');
});

//Extras-------------------------------------------------------------
function generateRandomString(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
}

function generateRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
