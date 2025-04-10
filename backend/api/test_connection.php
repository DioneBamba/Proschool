<?php
include('config.php');

if ($pdo) {
    echo "Connexion réussie à la base de données !";
} else {
    echo "Erreur de connexion à la base de données.";
}
?>