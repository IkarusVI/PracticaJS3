<?php
require "dbConnection.php";

function create()
{
    if (isset($_POST["name"]) && isset($_POST["lastname"]) && isset($_POST["password"]) && isset($_POST["number"]) && isset($_POST["email"]) && isset($_POST["gender"])) {

        $name = $_POST["name"];
        $lastname = $_POST["lastname"];
        $password = $_POST["password"];
        $number = $_POST["number"];
        $email = $_POST["email"];
        $gender = $_POST["gender"];
        
        // Asignar null si la fecha no está seteada
        $date = isset($_POST["date"]) ? $_POST["date"] : "1111-11-11";

        try {
            $connection = connect();
            $createUser = $connection->prepare("INSERT INTO alumno (nombre, apellidos, password, telefono, email, sexo, fecha_nacimiento) VALUES (:name, :lastname, :password, :number, :email, :gender, :date)");

            // Params
            $createUser->bindParam(':name', $name);
            $createUser->bindParam(':lastname', $lastname);
            $createUser->bindParam(':password', $password);
            $createUser->bindParam(':number', $number);
            $createUser->bindParam(':email', $email);
            $createUser->bindParam(':gender', $gender);
            $createUser->bindParam(':date', $date);

            // Ejecuta la sentencia preparada
            $createUser->execute();

            // Utiliza otra sentencia preparada para seleccionar el usuario recién creado
            $findUser = $connection->prepare("SELECT * FROM alumno WHERE telefono = :number");
            $findUser->bindParam(':number', $number);
            $findUser->execute();
            $userData = $findUser->fetch(PDO::FETCH_ASSOC);

            $response = [
                "success" => true,
                "message" => "Usuario creado correctamente",
                "data" => $userData,
            ];
        } catch (PDOException $e) {
            $response = [
                "success" => false,
                "message" => "Error al crear el usuario: " . $e->getMessage(),
            ];
        }
    } else {
        $response = [
            "success" => false,
            "message" => "Uno o más campos están vacíos. Por favor, completa todos los campos.",
        ];
    }

    return json_encode($response, JSON_UNESCAPED_UNICODE);
}

echo create();
