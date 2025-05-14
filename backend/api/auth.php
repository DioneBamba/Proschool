<?php
/*
include_once '../config/config.php';
require '../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$key = "secret_key";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    if (!empty($data->email) && !empty($data->password)) {
        $sql = "SELECT * FROM users WHERE email = ? LIMIT 1";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $data->email);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();

        if ($user && password_verify($data->password, $user['password'])) {
            $payload = [
                "user_id" => $user['id'],
                "email" => $user['email'],
                "role" => $user['role'],
                "exp" => time() + (60 * 60) // Expire en 1 heure
            ];
            $jwt = JWT::encode($payload, $key, 'HS256');
            echo json_encode(["token" => $jwt]);
        } else {
            echo json_encode(["message" => "Email ou mot de passe incorrect"]);
        }
    }
}
*/
?>
