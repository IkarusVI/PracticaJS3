<?php 

function connect(){
    $server = "localhost";
    $database = "colegio";
    $username = "root";
    $dbpassword = "root";
    $connection = new PDO("mysql:host=$server;dbname=$database", $username, $dbpassword);

    return $connection;
}

    