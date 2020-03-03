const flightNumber = document.getElementById('flight')
const seatNumber = document.getElementById('seat')
const nameDom = document.getElementById('name')
const emailDom = document.getElementById('email')
const anotherBtn = document.getElementById('another')
const idNumber = document.getElementById('id')
const anotherFlightBtn = document.getElementById('check-flight')

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
console.log(confirmationId)

if(confirmationId==='exist'){
    document.getElementById('200').classList.add('none')
    document.getElementById('409').classList.remove('none')
}


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
        console.log('confirmed data: ',userInformation)
        if (userInformation.status === 200) {
            userInformation = userInformation.data;
            flightNumber.innerText = userInformation.flight;
            seatNumber.innerText = userInformation.seat;
            nameDom.innerText = userInformation.givenName + ' ' + userInformation.surname;
            emailDom.innerText = userInformation.email;
            idNumber.innerText = userInformation.id
        } else {
            document.getElementById('200').classList.add('none')
            document.getElementById('409').classList.remove('none')
        }
    })


const anotherHandler = (event) => {
    anotherBtn.removeEventListener('click', anotherHandler)
    window.location.href = "http://localhost:8000/seat-select"
}

const checkFlightHandler = (event) => {
    anotherFlightBtn.removeEventListener('click', checkFlightHandler)
    window.location.href = `/seat-select/checkFlight.html`
}

anotherBtn.addEventListener('click', anotherHandler)
anotherFlightBtn.addEventListener('click', checkFlightHandler)