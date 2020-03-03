'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const reqRes = require('request-promise');

const { seatInfoHandler, orderHandler, confirmationInfoHandler, getFlightsHandler, checkFlightHandler } = require('./handlers')

const PORT = process.env.PORT || 8000;

express()
    .use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    })
	.use(morgan('dev'))
	.use(express.static('public'))
    .use(bodyParser.json())
    .use(express.urlencoded({extended: false}))
    
    // endpoints
    .post('/seating-information/:flightId', seatInfoHandler)
    .post('/order', orderHandler)
    .post('/confirmation-info', confirmationInfoHandler)
    .get(`/slingair/flights`, getFlightsHandler)
    .post('/slingair/users/checkFlight', checkFlightHandler)

    .use((req, res) => res.send('Not Found'))
    .listen(PORT, () => console.log(`Listening on port ${PORT}`));