

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