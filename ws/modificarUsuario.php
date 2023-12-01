<?php
require "dbConnection.php";

function modify(){
    
    if (isset($_GET["id"]) && (isset($_POST["name"]) || isset($_POST["lastname"]) || isset($_POST["password"]) || isset($_POST["number"]) || isset($_POST["email"]) || isset($_POST["gender"]) || isset($_POST["date"]))) {
        
        $id = $_GET["id"];

        $name = $_POST["name"];
        $lastname = $_POST["lastname"] ?? null;
        $password = $_POST["password"] ?? null;
        $number = $_POST["number"] ?? null;
        $email = $_POST["email"] ?? null;
        $gender = $_POST["gender"] ?? null;
        $date = $_POST["date"] ?? null;

        $connection = connect();
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Utilizar una sentencia preparada para seleccionar el usuario
        $findUser = $connection->prepare("SELECT * FROM alumno WHERE id = :id");
        $findUser->bindParam(':id', $id, PDO::PARAM_INT);
        $findUser->execute();
        
        if($findUser->rowCount() == 0){
            $response = [
                "success" => false,
                "message" => "La ID proporcionada no pertenece a ningún usuario",
                "data" => null
            ];
        } else {
            $updateAttributes = [];
            $params = [];

            if ($name !== null) {
                $updateAttributes[] = "nombre = :name";
                $params[':name'] = $name;
            }
            if ($lastname !== null) {
                $updateAttributes[] = "apellidos = :lastname";
                $params[':lastname'] = $lastname;
            }
            if ($password !== null) {
                $updateAttributes[] = "password = :password";
                $params[':password'] = $password;
            }
            if ($number !== null) {
                $updateAttributes[] = "telefono = :number";
                $params[':number'] = $number;
            }
            if ($email !== null) {
                $updateAttributes[] = "email = :email";
                $params[':email'] = $email;
            }
            if ($gender !== null) {
                $updateAttributes[] = "sexo = :gender";
                $params[':gender'] = $gender;
            }
            if ($date !== null) {
                $updateAttributes[] = "fecha_nacimiento = :date";
                $params[':date'] = $date;
            }

            // Construir la consulta SQL
            $updateQuery = "UPDATE alumno SET " . implode(", ", $updateAttributes) . " WHERE id = :id";
            
            // Preparar y ejecutar la consulta SQL
            $updateUser = $connection->prepare($updateQuery);
            $updateUser->bindParam(':id', $id, PDO::PARAM_INT);
            
            // Enlazar los parámetros
            foreach ($params as $key => &$value) {
                $updateUser->bindParam($key, $value);
            }

            $updateUser->execute();

            // Obtener los datos actualizados
            $findUser = $connection->prepare("SELECT * FROM alumno WHERE id = :id");
            $findUser->bindParam(':id', $id, PDO::PARAM_INT);
            $findUser->execute();
            $userData = $findUser->fetch(PDO::FETCH_ASSOC);

            $response = [
                "success" => true,
                "message" => "Usuario modificado correctamente",
                "data" => $userData
            ];
        }

    } else {
        $response = [
            "success" => false,
            "message" => "La ID proporcionada es nula",
            "data" => null
        ];
    }

    return json_encode($response, JSON_UNESCAPED_UNICODE);
}

echo modify();
