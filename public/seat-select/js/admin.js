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
    table.id = flight
    console.log(table.id)
    table.innerHTML = `<p>${flight}</p><tr><th id='seats' onclick="sortTable(${flight},0)">seat</th><th id='isAvailable' onclick="sortTable(${flight},1)">isAvailable?</th><th id='user-info' onclick="sortTable(${flight},2)">user info</th></tr>`
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
    table.id = 'users'
    table.innerHTML = `<p>users</p><tr><th onclick="sortTable(${table.id},0)">given Name</th><th onclick="sortTable(${table.id},1)">surname</th><th onclick="sortTable(${table.id},2)">email</th><th onclick="sortTable(${table.id},3)">flight</th><th onclick="sortTable(${table.id},4)">seat</th></tr>`
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

const sortTable = (tableId, columnNumber) => {
let table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = tableId;
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[columnNumber];
      y = rows[i + 1].getElementsByTagName("TD")[columnNumber];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount ++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

allUsersBtn.addEventListener('click',allUsersInfoHandler)

