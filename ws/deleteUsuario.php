<?php
require "dbConnection.php";

function delete(){
    // Obtener y filtrar el valor del parámetro "id"
    $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);

    if ($id !== false && $id !== null) {
        try {
            $connection = connect();

            // Utiliza una sentencia preparada para prevenir la inyección SQL
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
                // Utiliza otra sentencia preparada para eliminar el usuario
                $deleteUser = $connection->prepare("DELETE FROM alumno WHERE id = :id");
                $deleteUser->bindParam(':id', $id, PDO::PARAM_INT);
                $deleteUser->execute();
                $userData = $findUser->fetch(PDO::FETCH_ASSOC);

                $response = [
                    "success" => true,
                    "message" => "Usuario con id $id eliminado correctamente",
                    "data" => $userData,
                ];
            }
        } catch (PDOException $e) {
            $response = [
                "success" => false,
                "message" => "Error al eliminar el usuario: " . $e->getMessage(),
                "data" => null,
            ];
        }
    } else {
        $response = [
            "success" => false,
            "message" => "Error, id no válida o no proporcionada",
            "data" => null,
        ];
    }

    return json_encode($response, JSON_UNESCAPED_UNICODE);
}

echo delete();
