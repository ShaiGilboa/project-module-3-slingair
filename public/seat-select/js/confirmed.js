const flightNumber = document.getElementById('flight')
const seatNumber = document.getElementById('seat')
const nameDom = document.getElementById('name')
const emailDom = document.getElementById('email')
const anotherBtn = document.getElementById('another')
const moreReservationsBtn = document.getElementById('personal-reservations')

function reverse(s){
    return s.split("").reverse().join("");
}


let string = '' + window.location.href
let idStringLocation = string.length - 1;
let confirmationId = '';


while (string.charAt(idStringLocation) !== '='){
    confirmationId += (string.charAt(idStringLocation));
    // console.log(confirmationId)
    idStringLocation--;
}

confirmationId = reverse(confirmationId)

fetch('/confirmation-info', {
    method: 'POST',
    body: JSON.stringify({confirmationId}),
    headers: {
            "Content-Type": "application/json",
            "Accept" : "application/json"
        }, 
})
    .then(data=>data.json())
    .then(userInformation => {
        userInformation = userInformation.data;
        flightNumber.innerText = userInformation.flight;
        seatNumber.innerText = userInformation.seat;
        nameDom.innerText = userInformation.givenName + ' ' + userInformation.surname;
        emailDom.innerText = userInformation.email;
    })


const anotherHandler = (event) => {
    anotherBtn.removeEventListener('click', anotherHandler)
    window.location.href = "http://localhost:8000/seat-select"
}

const moreReservationsHandler = (event) => {
    moreReservationsBtn.removeEventListener('click', moreReservationsHandler)
    window.location.href = `http://localhost:8000/seat-select/confirmed-copy.html?id=${confirmationId}`
}

anotherBtn.addEventListener('click', anotherHandler)
moreReservationsBtn.addEventListener('click', moreReservationsHandler)