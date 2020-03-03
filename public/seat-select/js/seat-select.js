const flightInput = document.getElementById('flight');
const seatsDiv = document.getElementById('seats-section');
const confirmButton = document.getElementById('confirm-button');
const anotherFlightBtn = document.getElementById('check-flight')

let selection = '';

fetch(`/slingair/flights`)
    .then(response=>response.json())
    .then(response=> {
        const flightsArr =  response.data;
        flightsArr.forEach(flightId => {
            const anotherFlight = document.createElement('option');
            anotherFlight.value = `${flightId}`;
            anotherFlight.innerText = `${flightId}`
            flightInput.appendChild(anotherFlight)
        })
    })

const renderSeats = (seats) => {
    document.querySelector('.form-container').style.display = 'block';

    const alpha = ['A', 'B', 'C', 'D', 'E', 'F'];
    seatsDiv.innerHTML='';
    for (let r = 1; r < 11; r++) {
        const row = document.createElement('ol');
        row.classList.add('row');
        row.classList.add('fuselage');
        seatsDiv.appendChild(row);
        for (let s = 1; s < 7; s++) {
            const seatNumber = `${r}${alpha[s-1]}`;
            const seat = document.createElement('li')
            const seatOccupied = `<li><label class="seat"><span id="${seatNumber}" class="occupied">${seatNumber}</span></label></li>`
            const seatAvailable = `<li><label class="seat"><input type="radio" name="seat" value="${seatNumber}" /><span id="${seatNumber}" class="avail">${seatNumber}</span></label></li>`        
            let status = seats.find(seat => seat.id === seatNumber).isAvailable;
            status ? seat.innerHTML = seatAvailable: seat.innerHTML = seatOccupied;
            row.appendChild(seat);
        }
    }
    
    let seatMap = document.forms['seats'].elements['seat'];
    seatMap.forEach(seat => {
        seat.onclick = () => {
            selection = seat.value;
            seatMap.forEach(x => {
                if (x.value !== seat.value) {
                    document.getElementById(x.value).classList.remove('selected');
                }
            })
            document.getElementById(seat.value).classList.add('selected');
            document.getElementById('seat-number').innerText = `(${selection})`;
            confirmButton.disabled = false;
        }
    });
}

const checkFlightNumber = (flightNumber) => {
    let ret = false
    if(flightNumber.length === 5){
        if(flightNumber.charAt(0) === 'S'){
            if(flightNumber.charAt(1) === 'A'){
                let number = flightNumber.slice(2, 5).split('');
                if((parseInt(number[0]) + parseInt(number[1]) + parseInt(number[2])) >= 0) {
                    console.log('yes')
                    ret = true
                }
            }
        }
    }
    return ret;
}

const toggleFormContent = (event) => {
    const flightNumber = flightInput.value;
    let seats = [];
    let invalidInput = false;
    if(checkFlightNumber(flightNumber)) {
        fetch(`/seating-information/${flightNumber}`, {
            method: 'POST',
        })
        .then(response => response.json())
        .then(response => {
            if(response.status === '200'){
            const seatInfo = response.data;
            seats = seatInfo;
            renderSeats(seats);
            } else {
                console.log('flight cannot be found')
            }
        })
    } else {
        console.log('invalid input')
    }
}

const handleConfirmSeat = (event) => {
    // TODO: everything in here!
    event.preventDefault();
    const data = {
        givenName: givenName.value,
        surname: surname.value,
        email: email.value,
        seat: selection,
        flightNumber: flight.value
    }
    fetch('/order', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            "Accept" : "application/json"
        },
    })
    .then(data => data.json())
    .then(response=>{
        console.log(response)
        if (response.status === 200){
            let id = response.data;
            // console.log('id', response)
            // console.log(typeof response.data)
            window.location.href = `/seat-select/confirmed.html?id=${id}`
        } else if (response.status === 409) {
            window.location.href = '/seat-select/confirmed.html?id=exist'
        }
    })
}

const checkFlightHandler = (event) => {
    anotherFlightBtn.removeEventListener('click', checkFlightHandler)
    window.location.href = `/seat-select/checkFlight.html`
}

anotherFlightBtn.addEventListener('click', checkFlightHandler)