const reqRes = require('request-promise');

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
        if(reservation.status === 409){
            res.status(409).send({status: 409, message: "User already has a reservation."})
        } else {
            res.status(200).send({status: 200, data: reservation.id})
        }
    } catch(err) {console.log('Error: ', err)}
}

const pullUserInfo = async (userId) => {
    try {
        const info = await reqRes(`https://journeyedu.herokuapp.com/slingair/users/${userId}`)
        let userInfo = await JSON.parse(info);
        userInfo.data = checkUserName(userInfo.data)
        return userInfo
    } catch(err) {
        console.log('Error: ',JSON.parse(err.error))
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
            const info = await (pullUserInfo(userId))
            if(info.status===200){
                res.status(200).send({status: 200, data: info.data.id});
            } else if(info.status === 400){
                res.send({status:400})
            }
        } else if(email) {
            const info = await (pullUserInfo(email))
            if(info.status===200){
                res.status(200).send({status: 200, data: info.data.email});
            } else if(info.status === 400){
                res.send({status:400})
            }
        }
    } catch(err) {
        console.log('Error: ',err)
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
    let Length = 0;
    while(lode.length){
        for(let i =0; i<lode.length;i++){
            if(lode[i]!==null)allUsers.push(lode[i])
        }
        Length += lode.length
        lode = await reqRes(`https://journeyedu.herokuapp.com/slingair/users?limit=25&start=${Length}`)
        lode = JSON.parse(lode)
    }
    allUsers.forEach(user => {
        user = checkUserName(user);
    });
    return allUsers
}

const getUsersByFlightHandler = async (req, res) => {
    const {flight} = req.params;
    const allUsers = await getAllUsers();
    const flightUsers = allUsers.filter(user => user.flight === flight)
    res.status(200).send({status: 200, data: flightUsers})
}

const getusersHandler = async (req, res) => {
    const allUsers = await getAllUsers();
    res.status(200).send({status:200, data: allUsers})
}

module.exports = { seatInfoHandler, orderHandler, confirmationInfoHandler, getFlightsHandler, checkFlightHandler, getUsersByFlightHandler, getusersHandler }