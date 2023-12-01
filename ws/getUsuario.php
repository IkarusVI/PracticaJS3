<?php
require "dbConnection.php";

function get(){
    try {
        $connection = connect();

        if (isset($_GET["id"])) {
            // Si se proporciona un ID, buscar ese usuario específico
            $id = $_GET["id"];
            $findUser = $connection->prepare("SELECT * FROM alumno WHERE id = :id");
            $findUser->bindParam(':id', $id, PDO::PARAM_INT);
            $findUser->execute();

            if ($findUser->rowCount() == 0) {
                $response = [
                    "success" => false,
                    "message" => "Usuario con id $id no encontrado",
                    "data" => null,
                ];
            } else {
                $userData = $findUser->fetch(PDO::FETCH_ASSOC);
                $response = [
                    "success" => true,
                    "message" => "Usuario con id $id obtenido correctamente",
                    "data" => $userData,
                ];
            }
        } else {
            // Si no se proporciona un ID, obtener todos los usuarios
            $getAllUsers = $connection->query("SELECT * FROM alumno");
            $usersData = $getAllUsers->fetchAll(PDO::FETCH_ASSOC);

            $response = [
                "success" => true,
                "message" => "Se obtuvieron todos los usuarios correctamente",
                "data" => $usersData,
            ];
        }
    } catch (PDOException $e) {
        $response = [
            "success" => false,
            "message" => "Error al obtener el usuario: " . $e->getMessage(),
            "data" => null,
        ];
    }

    return json_encode($response, JSON_UNESCAPED_UNICODE);
}

echo get();

