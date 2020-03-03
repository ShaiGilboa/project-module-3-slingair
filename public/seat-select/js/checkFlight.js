const anotherBtn = document.getElementById('another')
const four00 = document.getElementById('400')

const anotherHandler = (event) => {
    anotherBtn.removeEventListener('click', anotherHandler)
    window.location.href = "http://localhost:8000/seat-select"
}

const handleIdNumberSubmit = (event) =>{
    event.preventDefault()
    const userId = id.value
    console.log(userId)
    fetch('/slingair/users/checkFlight', {
        method: 'POST',
        body: JSON.stringify({userId}),
        headers: {
            "Content-Type": "application/json",
            "Accept" : "application/json"
        },
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 200) {
                const id = data.data.id;
                console.log('id ',id)
                window.location.href = `/seat-select/confirmed.html?id=${id}`
            } else if (data.status === 400){
                four00.classList.remove('none')
                four00.innerText += '....'
                console.log('Erroe')
            }
        })
}

const handleUserInfoSubmit = (event) => {
    event.preventDefault()
    const data = {
        email: email.value, 
    }
    fetch('/slingair/users/checkFlight', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            "Accept" : "application/json"
        },
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if (data.status === 200) {
                const email = data.data.email;
                console.log('yeye')
                window.location.href = `/seat-select/confirmed.html?id=${email}`
            } else if (data.status === 400){
                four00.classList.remove('none')
                four00.innerText += '....'
                console.log('Erroe')
            }
        })
}

anotherBtn.addEventListener('click', anotherHandler)
