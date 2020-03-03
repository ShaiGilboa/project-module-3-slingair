const { seats } = require('./test-data/flightSeating');
const { reservations } = require('./test-data/reservations')

let id = '0';

const seatInfoHandler = (req, res) => {
    const {flightId} = req.params;
    const flightsId = Object.keys(seats);
    flightsId.includes(flightId) ? res.status(200).send({status: '200', data: seats[flightId]}) : res.send('Nope')
    
}

const randomNumberInRange = (min, max) => {
    return Math.floor(Math.random() * (min + max) + min);
}

const getNewID = () => {
    while(reservations.some(user => user.id === id)){
        id = ''+randomNumberInRange(0,10000000)
    }
    id = '' + id
}

const pushNewCustomer = (customer) => {
    reservations.push(customer)
}

const orderHandler = (req, res) => {
    const {givenName, surname, email, seat, flightNumber} = req.body
    getNewID();
    pushNewCustomer({givenName, surname, email, seat, flight: flightNumber,id})
    let currentSeatIndex = seats[flightNumber].findIndex(flightSeat => flightSeat.id===seat)
    seats[flightNumber][currentSeatIndex].isAvailable = false;
    // console.log('reservations ',reservations)
    res.status(200).send({status: 200, data: {id}})
}

const confirmationInfoHandler = (req, res) => {
    const {confirmationId} = req.body;
    // console.log('confirmationId ', confirmationId)
    // console.log('reservations SSSSSSSSSSSSSSSSSSSSSSSSSS',reservations)
    let userInformation = reservations.findIndex(user => user.id===confirmationId);
    // console.log("GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG ", userInformation)
    userInformation = reservations[userInformation];
    console.log(userInformation)
    res.status(200).send({status: 200, data: userInformation})
}

module.exports = { seatInfoHandler, orderHandler, confirmationInfoHandler }