const { flights } = require('./test-data/flightSeating');
const { reservations } = require('./test-data/reservations')
const reqRes = require('request-promise');

let id = '0';

const seatInfoHandler = async (req, res) => {
    try {
        const {flightId} = req.params;
        const info = await reqRes('https://journeyedu.herokuapp.com/slingair/flights');
        const parsed = await JSON.parse(info)
        const flightsId = parsed.flights
        if(flightsId.includes(flightId)){
            const Info = await reqRes(`https://journeyedu.herokuapp.com/slingair/flights/${flightId}`)
            const flightInfo = await JSON.parse(Info)
            res.status(200).send({status: '200', data: flightInfo[flightId]})
        } else {
            res.send('Nope')
        }
    } catch(err) {console.log('Error: ', err)}
}

const makeOrder = async (reservation) => {
    const inf = {
        method: 'POST',
        uri: 'https://journeyedu.herokuapp.com/slingair/users',
        body: reservation,
        headers: {
            "Content-Type": "application/json",
            "Accept" : "application/json"
        },
        json: true
    }
    try {
        const resp = await reqRes(inf)
        console.log('______________________________________________________________________________________________')
        console.log(resp.reservation)
        if(resp.status===201){
            return resp.reservation;
        } else {
            return resp.status
        }
    } catch(err) {
        console.log('Error: ', err);
        return {status: 409, message:"User already has a reservation."}}
}

const orderHandler = async (req, res) => {
    const {givenName, surname, email, seat, flightNumber} = req.body
    try {
        const reservation = await makeOrder({givenName, surname, email, seat, flight: flightNumber})
        // console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
        // console.log(reservation)
        if(reservation.status === 409){
            res.status(409).send({status: 409, message: "User already has a reservation."})
        } else {
            // console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')
            // console.log(reservation)
            res.status(200).send({status: 200, data: reservation.id})
        }
    } catch(err) {console.log('Error: ', err)}
}

const pullUserInfo = async (userId) => {
    try {
        const info = await reqRes(`https://journeyedu.herokuapp.com/slingair/users/${userId}`)
        // console.log('))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))')
        // console.log(info)
        const userInfo = await JSON.parse(info);
        // console.log('??????????????????????/')
        // console.log(userInfo.data)
        return userInfo
    } catch(err) {
        console.log('Error: ',err)
        return {status:400}
        }
}

const confirmationInfoHandler = async (req, res) => {
    const {confirmationId} = req.body;
    const userInfo = await pullUserInfo(confirmationId)
    res.status(200).send(userInfo)
}

const getFlightsHandler = async (req, res) => {
    try {
        let test = await reqRes('https://journeyedu.herokuapp.com/slingair/flights')
        test = await JSON.parse(test)
        res.status(200).send({status: 200, data: test.flights})
    } catch(err) {console.log('Error: ',err)}
}

const checkFlightHandler = async (req, res) => {
    const {userId, email} = req.body;
    try {
        if(userId) {
            console.log('55555555555555555555555555555555555555555555555555555555555');
            const info = await (pullUserInfo(userId))
            console.log(info)
            if(info.status===200){
            res.status(200).send(info);
            } else if(info.status === 400){
                res.send({status:400})
            }
        } else if(email) {
            const info = await (pullUserInfo(email))
            console.log('LLLLLLLLLLLLLLLLLLL');
            console.log(info)
            if(info.status===200){
                res.status(200).send(info);
            } else if(info.status === 400){
                res.send({status:400})
            }
        }
    } catch(err) {
        console.log('Error: ',err)
        console.log('------------------------------------------------------------');
        }
}

module.exports = { seatInfoHandler, orderHandler, confirmationInfoHandler, getFlightsHandler, checkFlightHandler }