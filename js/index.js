class Client {
    constructor(id, firstname, lastname, phone, email, gender) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.phone = phone;
        this.email = email;
        this.gender = gender;
    }
}
//Array que nos ayudará mas tarde para filtrar los usuarios
var printable = [];

//Llama al método getUsuario.php para obtener los usuarios de la base de datos
let getClients = () => {
    let urlActual = window.location.href;
    let url = urlActual.substring(0, urlActual.lastIndexOf("/"));
    let ruta = url + "/ws/getUsuario.php";

    return fetch(ruta)
        .then(res => res.json())
        .then(data => {
            resultados = data;
            return data;
        })
        .catch(error => {
            return e;
        });
};

//Método para crear las tablas de los usuarios y volcarlas en el DOM
let loadClient = (c) => {

    let tableRow = document.createElement("tr");
    tableRow.id = 'client-' + c.id;
    tableRow.classList.add("client");

    let xCell = document.createElement("td");
    xCell.textContent = 'x';
    xCell.classList.add('delete');
    xCell.id = 'delete-' + c.id;

    let modifyCell = document.createElement("td");
    modifyCell.textContent = 'Editar';
    modifyCell.classList.add('modify');
    modifyCell.id = 'modify-' + c.id;

    let firstNameCell = document.createElement("td");
    firstNameCell.textContent = c.firstname;

    let lastNameCell = document.createElement("td");
    lastNameCell.textContent = c.lastname;

    let phoneCell = document.createElement("td");
    phoneCell.textContent = c.phone;

    let emailCell = document.createElement("td");
    emailCell.textContent = c.email;

    let genderCell = document.createElement("td");
    if (c.gender == "H") {
        genderCell.textContent = "Hombre";
    }
    if (c.gender == "M") {
        genderCell.textContent = "Mujer";
    }

    tableRow.appendChild(xCell);
    tableRow.appendChild(modifyCell);
    tableRow.appendChild(firstNameCell);
    tableRow.appendChild(lastNameCell);
    tableRow.appendChild(phoneCell);
    tableRow.appendChild(emailCell);
    tableRow.appendChild(genderCell);

    let table = document.getElementById("tbody");
    table.appendChild(tableRow);
};

/*
    1-> Llama al método getClients, obtiene los datos del JSON.
    2-> Instancia los objetos Cliente con esos datos
    3-> Vuelca esos clientes en el DOM y en printable[] llamando al método loadClient
*/

let storeClients = () => {
    getClients()
        .then(data => {
            if (data["success"] == true) {

                let clients = data["data"];
                for (let i = 0; i < clients.length; i++) {
                    let client = new Client(clients[i]["id"], clients[i]["nombre"],
                        clients[i]["apellidos"], clients[i]["telefono"],
                        clients[i]["email"], clients[i]["sexo"]);
                    loadClient(client);
                    printable.push(client);
                }

                Swal.fire(
                    'Clientes Cargados con éxito!',
                    data["message"],
                    'success'
                )

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops... Algo salió mal :(',
                    text: data["message"],
                })
            }
        })
        .catch(e => {
            return e;
        });
};

//Método para eliminar los clientes del DOM y posteriormente de la BD con una alerta de confirmación al usuario
let deleteClient = () => {
    let tbody = document.getElementById("tbody");

    tbody.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete")) {

            Swal.fire({
                title: '¿Estás seguro de que quieres eliminar a este cliente?',
                text: "¡¡No podrás revertirlo después!!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, Bórralo'
            })
                .then((result) => {
                    if (result.isConfirmed) {

                        let clientId = e.target.id.replace('delete-', '');

                        // Busca el elemento cliente en el DOM y lo elimina
                        let client = document.getElementById("client-" + clientId);
                        client.remove();

                        // Eliminar también el elemento del array printable que usaremos para el filtro
                        for (let i = 0; i <= printable.length; i++) {
                            if (clientId == printable[i].id) {
                                printable.splice(i, 1);
                                break;
                            }
                        }

                        // Llama al método deleteUsuario.php y elimina al usuario de la BD
                        let urlActual = window.location.href;
                        let url = urlActual.substring(0, urlActual.lastIndexOf("/"));
                        let ruta = url + "/ws/deleteUsuario.php";

                        let formData = new FormData();
                        formData.append("id", clientId);

                        fetch(ruta, {
                            method: 'POST',
                            body: formData
                        })
                            .then(res => res.json())
                            .then(data => {

                                if (data["success"] == true) {
                                    Swal.fire(
                                        'Cliente Eliminado!',
                                        data["message"],
                                        'success'
                                    )
                                } else {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Oops... Algo salió mal :(',
                                        text: data["message"],
                                    })
                                }
                            })
                            .catch(e => {
                                return e;
                            });
                    }
                })
        }
    })
};

//Método para crear el modal con los valores del usuario en la bd

let createModal = () => {
    let tbody = document.getElementById("tbody");

    tbody.addEventListener('click', (e) => {
        //comprueba que está haciendo click dentro del elemento 
        if (e.target.classList.contains("modify")) {
            let clientId = e.target.id.replace('modify-', '');

            //Prepara una petición fetch para obtener los datos del usuario y rellenar el modal con ellos
            let urlActual = window.location.href;
            let url = urlActual.substring(0, urlActual.lastIndexOf("/"));
            let ruta = `${url}/ws/getUsuario.php?id=${clientId}`;
            fetch(ruta)
                .then(res => res.json())
                .then(data => {
                    let clientData = data["data"];
                    let modal = `
                        <div id="modal${clientData["id"]}" class="modal">
                            <form id="form-modal" class="${clientData["id"]}">
                                <label for="name">Nombre:</label>
                                <input id="name" value="${clientData["nombre"]}" type="text">
                        
                                <label for="lastname">Apellido:</label>
                                <input id="lastname" value="${clientData["apellidos"]}" type="text">
                        
                                <label for="phone">Teléfono:</label>
                                <input id="phone" value="${clientData["telefono"]}" type="text">
                        
                                <label for="email">Correo electrónico:</label>
                                <input id="email" value="${clientData["email"]}" type="email">
                        
                                <label for="gender">Género:</label>
                                <input id="gender" value="${clientData["sexo"]}" type="text">

                                <div id="save">Guardar</div>
                                <div id="cancel">Cancelar</div>

                            </form>
                        </div>
                    `;
                    //Una vez definido el modal lo plasma en el DOM
                    const container = document.getElementById("container-modal");
                    container.innerHTML = modal;
                })
                .catch(e => {
                    console.error(e);
                });
        }
    });
};

//Método para modificar los datos del usuario

let modifyClient = () => {
    let modalContainer = document.getElementById("container-modal");
    modalContainer.addEventListener("click", (e) => {
        //si el elemento clicado es el boton guardar
        if (e.target.id.includes("save")) {


            Swal.fire({
                title: '¿Estás seguro de que quieres modificar este usuario?',
                text: "¡¡No podrás revertirlo después!!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si'
            })
                .then((result) => {

                    if (result.isConfirmed) {
                        let idValue = document.getElementById("form-modal").className;

                        let urlActual = window.location.href;
                        let url = urlActual.substring(0, urlActual.lastIndexOf("/"));
                        //Le pasa por la ruta la id del cliente que queremos modificar
                        let ruta = url + `/ws/modificarUsuario.php?id=${idValue}`;

                        //Si las propiedades son null las dejamos como espacios en blanco para que no le aparezca null al usuario
                        let nameValue = document.getElementById("name").value ?? "";
                        let lastnameValue = document.getElementById("lastname").value ?? "";
                        let phoneValue = document.getElementById("phone").value ?? "";
                        let emailValue = document.getElementById("email").value ?? "";
                        let genderValue = document.getElementById("gender").value ?? "";

                        //Parametros POST para la petición fetch del body
                        let formData = new FormData();
                        formData.append("name", nameValue);
                        formData.append("lastname", lastnameValue);
                        formData.append("number", phoneValue);
                        formData.append("email", emailValue);
                        formData.append("gender", genderValue);

                        fetch(ruta, {
                            method: 'POST',
                            body: formData
                        })
                            .then(res => res.json())
                            .then(data => {
                                if (data["success"] == true) {
                                    Swal.fire({
                                        title: 'Cliente Modificado con éxito!',
                                        text: data["message"],
                                        icon: 'success',

                                        //Cuando el usuario pulse okay...
                                        didClose: () => {
                                            let tbody = document.getElementById("tbody");
                                            
                                            //Vacia el contenedor de los usuarios para cargalos sin duplicidades después
                                            tbody.innerHTML = "";
                                            let modal = document.getElementById("form-modal");

                                            //Elimina el modal del DOM ya que ya ha cumplido su función
                                            modal.remove();

                                            //Resetea printable para que no haya duplicidades al cargarlo nuevamente en storeClients();
                                            printable = [];

                                            //Carga los nuevos clientes modificados
                                            storeClients();
                                        }
                                    });
                                } else {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Oops... Algo salió mal :(',
                                        text: data["message"],
                                    })
                                }
                            })
                            .catch(e => {
                                return e;
                            });

                    }
                })

        }
        //Si el elemento clicado es cancelar cierra el modal
        if (e.target.id.includes("cancel")) {
            let modal = document.getElementById("form-modal");
            modal.remove();
        }
    })

}

//Método para filtrar los usuarios

let filter = () => {

    let filter = document.getElementById("filter");

    filter.addEventListener("input", () => {
        let search = filter.value.toLowerCase();

        if (search.length >= 3) {

            let visible = [];

            // Itera sobre el array printable y si se encuentran coincidencias cambia la visibilidad a true, sino queda en false
            for (let i = 0; i < printable.length; i++) {
                visible[i] = printable[i].firstname.toLowerCase().includes(search) || printable[i].lastname.toLowerCase().includes(search);
            }

            let clients = document.querySelectorAll(".client");

            // Según la visibilidad asignada true/false muestra el elemento en pantalla
            clients.forEach((client, i) => {
                client.style.display = visible[i] ? "" : "none";
            });

        } else {
            // Cuando el filtro se desactiva pone a todos los usuarios como viisbles
            document.querySelectorAll(".client").forEach(client => client.style.display = "");
        }
    });
}


storeClients();
deleteClient();
createModal();
modifyClient();
filter();

