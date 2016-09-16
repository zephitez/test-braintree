'use strict';
var express = require('express');
var router = express.Router();
var braintree = require('braintree');

/*=====
 SETUP
======*/

// set up Braintree
var gateway = braintree.connect({
    environment:  braintree.Environment.Sandbox,
    merchantId:   'g8v4bngrqncdxxcc',
    publicKey:    '63pc7qmxgvgngy3r',
    privateKey:   '45f413d5dae92375d751b1752b7f05f4'
});

router.get('/', function (req, res) {
    res.redirect('index.html');
});

/*==========
 GET TOKEN
===========*/
router.get('/get_token', function (req,res) {
    // generate client token
   gateway.clientToken.generate({}, function(err, response){
     res.send(response);

   });
});

/*===============
 PROCESS PAYMENT
================*/
router.post('/pay', function (req, res) {
    // create a transaction
    var price = req.body.price;
    var nonce = req.body.payment_method_nonce;

    gateway.transaction.sale({
      amount: price,
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: true
      }
    }, function(err, result) {
      console.log(result);
      if (result.success) {
        res.redirect('success.html');
      }

    });
});

module.exports = router;
