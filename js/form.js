let createClient = () => {
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        let genderRadios = document.getElementsByName('Gender');
        let selectedGender;
        for (var i = 0; i < genderRadios.length; i++) {
            // Verifica si el radio está seleccionado
            if (genderRadios[i].checked) {
                selectedGender = genderRadios[i].value;
                break;
            }
        }

        let name = document.getElementById("name").value;
        let lastname = document.getElementById("lastname").value;
        let password = document.getElementById("pass").value;
        let number = document.getElementById("number").value;
        let email = document.getElementById("email").value;


        let urlActual = window.location.href;
        let url = urlActual.substring(0, urlActual.lastIndexOf("/"));
        let ruta = url + "/ws/crearUsuario.php";

        let formData = new FormData();
        formData.append("name", name);
        formData.append("lastname", lastname);
        formData.append("password", password);
        formData.append("number", number);
        formData.append("email", email);
        formData.append("gender", selectedGender);

        fetch(ruta, {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(data => {

                if (data["success"] == true) {
                    Swal.fire(
                        'Cliente Creado con éxito!',
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

    });
}
createClient();