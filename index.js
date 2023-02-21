'use strict';

const path = require('path');

const express = require('express');
const app = express();

const {port,host,storage} = require('./serverConfig.json');

const Datastorage = require(path.join(__dirname,storage.storageFolder,storage.dataLayer));

const dataStorage=new Datastorage();

app.set('view engine','ejs');
app.set('views', path.join(__dirname,'pages'));

app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));

const menuPath=path.join(__dirname,'menu.html');

app.get('/', (req,res)=>res.sendFile(menuPath));

app.get('/all', (req,res)=>
    dataStorage.getAll().then(data=>res.render('allProducts',{result:data}))
);

app.get('/getProduct', (req,res)=>
    res.render('getProduct',{
        title:'Get',
        header1:'Get',
        action:'/getProduct'  
    })
);

app.post('/getProduct', (req,res)=>{
    if(!req.body) return res.sendStatus(500);

    const productID = req.body.id;
    dataStorage.getOne(productID)
        .then(product=>res.render('productPage',{result:product}))
        .catch(error=>sendErrorPage(res,error));

});

app.get('/inputForm', (req,res)=> 
    res.render('form',{
        title:'Add Product',
        header1:'Add a New Product',
        action:'/input',
        id:{value:'', readonly:''},
        name: { value: '', readonly: '' },
         model : { value: '', readonly: '' },
        type: { value: '', readonly: '' },
        amount: { value: '', readonly: '' }
}));

app.post('/input', (req,res)=>{
    if(!req.body) return res.statusCode(500);

    dataStorage.insert(req.body)
        .then(status=>sendStatusPage(res,status))
        .catch(error=>sendErrorPage(res,error))
});

app.get('/updateForm', (req, res) =>
    res.render('form', {
        title: 'Update Product',
        header1: 'Update Product Data',
        action: '/updateData',
        id: { value: '', readonly: '' },
        name: { value: '', readonly: 'readonly' },
        model: { value: '', readonly: 'readonly' },
        type : { value: '', readonly: 'readonly' },
        amount: { value: '', readonly: 'readonly' }
    }));

app.post('/updateData', (req,res)=>{
    if(!req.body) return res.sendStatus(500);

    dataStorage.getOne(req.body.id)
        .then(product=>
            res.render('form', {
                title: 'Update Product',
                header1: 'Update Product data',
                action: '/update',
                id: { value: product.id, readonly: 'readonly' },
                name : { value: product.name , readonly: '' },
                model: { value: product.model, readonly: '' },
                type: { value: product.type, readonly: '' },
                amount: { value: product.amount, readonly: '' }
            })
        )
        .catch(error=>sendErrorPage(res,error));
});

app.post('/update', (req, res) => {
    if (!req.body) return res.statusCode(500);

    dataStorage.update(req.body)
        .then(status => sendStatusPage(res, status))
        .catch(error => sendErrorPage(res, error))
});

app.get('/removeProduct', (req, res) =>
    res.render('getProduct', {
        title: 'Remove',
        header1: 'Remove Product',
        action: '/removeProduct'
    })
);

app.post('/removeProduct', (req, res) => {
    if (!req.body) return res.sendStatus(500);

    const productID = req.body.id;
    dataStorage.remove(productID)
        .then(status => sendStatusPage(res,status))
        .catch(error => sendErrorPage(res, error));

});

app.listen(port,host, ()=>console.log(`Server ${host}:${port} listening...`));

function sendErrorPage(res, error, title='Error',header1='Error'){
    sendStatusPage(res,error,title,header1);
}

function sendStatusPage(res, status,title='Status',header1='Status'){
    return res.render('statusPage',{title,header1,status});
}