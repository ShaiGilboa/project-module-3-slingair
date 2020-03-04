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
        let userInfo = await JSON.parse(info);
        // console.log('??????????????????????/')
        userInfo.data = checkUserName(userInfo.data)
        // console.log(userInfo)
        return userInfo
    } catch(err) {
        console.log('Error: ggggggggggggggggggggg',JSON.parse(err.error))
        return {status:400}
        }
}

const confirmationInfoHandler = async (req, res) => {
    const {confirmationId} = req.body;
    const userInfo = await pullUserInfo(confirmationId)
    console.log(')))))))))))))))))))))))))))))))))))))))))')
    console.log(userInfo)
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
            const info = await (pullUserInfo(userId))
            // console.log(info)
            if(info.status===200){
                res.status(200).send({status: 200, data: info.data.id});
            } else if(info.status === 400){
                res.send({status:400})
            }
        } else if(email) {
            const info = await (pullUserInfo(email))
                // console.log('55555555555555555555555555555555555555555555555555555555555');
                // console.log(info.data.email)
            // console.log('LLLLLLLLLLLLLLLLLLL');
            // console.log(info)
            if(info.status===200){
                console.log(info)
                res.status(200).send({status: 200, data: info.data.email});
            } else if(info.status === 400){
                res.send({status:400})
            }
        }
    } catch(err) {
        console.log('Error: ',err)
        // console.log('------------------------------------------------------------');
        }
}

const checkUserName = (user) => {
    if(user.firstName)user.givenName = user.firstName
    if(user.lastName)user.surname = user.lastName
    return user;
}

const getAllUsers = async () => {
    const allUsers = [];
    let lode = [];
    lode = await reqRes('https://journeyedu.herokuapp.com/slingair/users?limit=25&start=0')
    lode = JSON.parse(lode)
    // console.log('lode ',lode)
    let Length = 0;
    console.log(lode.length)
    while(lode.length){
        for(let i =0; i<lode.length;i++){
            if(lode[i]!==null)allUsers.push(lode[i])
        }
        Length += lode.length
        lode = await reqRes(`https://journeyedu.herokuapp.com/slingair/users?limit=25&start=${Length}`)
        lode = JSON.parse(lode)
        // console.log(lode.length)
    }
    console.log('fffffffffffffff ')
    // console.log(allUsers.length)
    allUsers.forEach(user => {
        user = checkUserName(user);
    });
    return allUsers
}

const getUsersByFlightHandler = async (req, res) => {
    const {flight} = req.params;
    console.log(flight)
    const allUsers = await getAllUsers();
    const flightUsers = allUsers.filter(user => user.flight === flight)
    console.log('gggggggggggggggggggg ',flightUsers)
    res.status(200).send({status: 200, data: flightUsers})
}

const getusersHandler = async (req, res) => {
    const allUsers = await getAllUsers();
    res.status(200).send({status:200, data: allUsers})
}

module.exports = { seatInfoHandler, orderHandler, confirmationInfoHandler, getFlightsHandler, checkFlightHandler, getUsersByFlightHandler, getusersHandler }