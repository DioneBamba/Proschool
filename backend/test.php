<?php
echo '$2y$10$3j9pGBY3xr6YEntl70YBOuxW.0avoPOgXVow2UpIJls...';
$testPassword = "khadimdione0410";
$hashed = password_hash($testPassword, PASSWORD_BCRYPT);

echo "\nTest hash: " . $hashed . "\n";
echo password_verify($testPassword, $hashed) ? "Mot de passe vérifié" : "Erreur de vérification";
?>