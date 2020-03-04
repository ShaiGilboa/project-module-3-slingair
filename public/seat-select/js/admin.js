const information = document.getElementById('information')
const checkBoxes = document.getElementById('checkboxes')
const allUsersBtn = document.getElementById('all-user-info')


let selection = '';

fetch(`/slingair/flights`)
    .then(response=>response.json())
    .then(response=> {
        const flightsArr =  response.data;
        for(i=0; i<flightsArr.length;i++){
            const flightId = flightsArr[i]
            const flightBox = document.createElement('input')
            flightBox.type = 'checkbox'
            flightBox.id = `flight${i}`
            flightBox.name = `flight${i}`
            flightBox.value = `${flightId}`
            const flightLabel = document.createElement('label');
            flightLabel.for = `flight${i}`
            flightLabel.innerText = `${flightId}`
            checkBoxes.appendChild(flightBox)
            checkBoxes.appendChild(flightLabel)
        }
        flightsArr.forEach(flightId => {
        })
        checkBoxes.innerHTML += '<button type="submit" value="Submit" class="button confirm">submit</button>'
    })

const renderSeats = (seats, flight) => {
    information.innerHTML = '';
    let table = document.createElement('table')
    table.innerHTML = `<p>${flight}</p><tr><th>seat</th><th>isAvailable?</th><th>user info</th>`
    let users = null;
    fetch(`/slingair/getusers/${flight}`)
        .then(response => response.json())
        .then(response => {
            users = response.data
            for (let i = 0;  i < seats.length; i++) {
                const row = document.createElement('tr');
                const seat = seats[i].id;
                const isAvailable = seats[i].isAvailable
                let html = `<tr><td>${seat}</td><td>${isAvailable}</td>`
                const user = users.find(user=> user.seat === seat)
                user ? html = html + `<td><a href="/seat-select/confirmed.html?id=${user.id}">${user.givenName} ${user.surname}</a></td></tr>` : html = html+`<td></td></tr>`
                row.innerHTML = html
                table.appendChild(row)
            }
            information.appendChild(table)
        })
}

const checkFlightNumber = (flightNumber) => {
    let ret = false
    if(flightNumber.length === 5){
        if(flightNumber.charAt(0) === 'S'){
            if(flightNumber.charAt(1) === 'A'){
                let number = flightNumber.slice(2, 5).split('');
                if((parseInt(number[0]) + parseInt(number[1]) + parseInt(number[2])) >= 0) {
                    ret = true
                }
            }
        }
    }
    return ret;
}

const toggleFormContent2 = (event) => {
    event.preventDefault();
    let flights = [];
    let i =0;
    let flight =document.getElementById(`flight${i}`)
    while(flight){
        if (flight.checked) flights.push(flight.value)
        i++;
        flight = document.getElementById(`flight${i}`)
    }
    flights.forEach(flight => {
        if(checkFlightNumber(flight)) {
            fetch(`/seating-information/${flight}`, {
                method: 'POST',
            })
            .then(response => response.json())
            .then(response => {
                if(response.status === '200'){
                const seatInfo = response.data;
                seats = seatInfo;
                renderSeats(seats, flight);
                } else {
                    console.log('flight cannot be found')
                }
            })
        } else {
            console.log('invalid input')
        }
    })
}

const renderUsers = (users) => {
    information.innerHTML = '';
    let table = document.createElement('table')
    table.innerHTML = `<p>users</p><tr><th>given Name</th><th>surname</th><th>email</th><th>flight</th><th>seat</th>`
    users.forEach(user=>{
        const row = document.createElement('tr');
        const{givenName,surname,email,flight,seat,id} = user
        const html = `<tr><td>${givenName}</td><td>${surname}</td><td>${email}</td><td>${flight}</td><td><a href="/seat-select/confirmed.html?id=${id}">${seat}</td>`
        row.innerHTML += html;
        table.appendChild(row)
    })
    information.appendChild(table)
}

const allUsersInfoHandler = (event) => {
    fetch('/slingair/getusers')
        .then(response => response.json())
        .then(response => {
            renderUsers(response.data)
        })
}

allUsersBtn.addEventListener('click',allUsersInfoHandler)

