function validarFormulario() {
let nombre = document.getElementById("nombre").value;
let rut = document.getElementById("rut").value;
let email = document.getElementById("email").value;
let telefono = document.getElementById("telefono").value;

if(nombre === "") {
alert("Debes ingresar el nombre completo");
return false;
}

if(rut === "") {
alert("Debes ingresar el RUT");
return false;
}

if(rut.length < 9) {
alert("El RUT debe tener al menos 9 caracteres");
return false;
}

if(email !== "") {
if(!email.includes("@") || !email.includes(".")) {
alert("Ingresa un correo electrónico válido");
return false;
}
}

if(telefono !== "") {
if(telefono.length < 11) {
alert("El teléfono debe tener al menos 11 caracteres");
return false;
}
}

alert("Destinatario agregado con éxito");
return true;
}