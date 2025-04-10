<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
// file_put_contents("debug_log.txt", "Requête reçue : " . print_r($_GET, true) . "\n", FILE_APPEND);

require_once "config.php";
require '../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$secret_key = "authentik_bamba";   // Change cette clé secrète

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, , X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json; charset=utf-8');
// header('Content-Type: application/json');
// error_reporting(E_ALL);
// ini_set('display_errors', 0);


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $method = $_SERVER['REQUEST_METHOD'];
    $action = isset($_GET['action']) ? $_GET['action'] : '';
    
    // Pour les élèves
 
    // switch ($method) {
    //     case 'GET':
    //         if ($action == 'getEleves') {
    //             $query = "SELECT e.id, e.prenom, e.nom, e.date_naissance, e.classe_id, 
    //                             c.nom_classe, e.groupe, e.nationalite, 
    //                             e.adresse, e.telephone, e.sexe, 
    //                             e.cout_scolarite, e.montant_paye
    //                         FROM eleves e
    //                         LEFT JOIN classes c ON e.classe_id = c.id";
    //             $stmt = $pdo->prepare($query);
    //             $stmt->execute();
    //             echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    //         }
    //         break;
        
    //     case 'POST':
    //         $data = json_decode(file_get_contents("php://input"), true);
            
    //         if ($action == 'ajouterEleve') {
    //             $query = "INSERT INTO eleves (prenom, nom, date_naissance, classe_id, groupe, nationalite, adresse, telephone, sexe, cout_scolarite, montant_paye) 
    //                       VALUES (:prenom, :nom, :date_naissance, :classe_id, :groupe, :nationalite, :adresse, :telephone, :sexe, :cout_scolarite, :montant_paye)";
    //             $stmt = $pdo->prepare($query);
    //             if ($stmt->execute($data)) {
    //                 echo json_encode(["message" => "Élève ajouté avec succès"]);
    //             } else {
    //                 echo json_encode(["error" => "Erreur lors de l'ajout de l'élève"]);
    //             }
    //         }
    //         break;
            
    //     case 'PUT':
    //         $data = json_decode(file_get_contents("php://input"), true);
    //         if ($action == 'modifierEleve' && isset($_GET['id'])) {
    //             $query = "UPDATE eleves SET prenom=:prenom, nom=:nom, date_naissance=:date_naissance, classe_id=:classe_id, 
    //                       groupe=:groupe, nationalite=:nationalite, adresse=:adresse, telephone=:telephone, sexe=:sexe, 
    //                       cout_scolarite=:cout_scolarite, montant_paye=:montant_paye WHERE id=:id";
    //             $stmt = $pdo->prepare($query);
    //             $data['id'] = $_GET['id'];
    //             if ($stmt->execute($data)) {
    //                 echo json_encode(["message" => "Élève modifié avec succès"]);
    //             } else {
    //                 echo json_encode(["error" => "Erreur lors de la modification de l'élève"]);
    //             }
    //         }
    //         break;
        
    //     case 'DELETE':
    //         if ($action == 'supprimerEleve' && isset($_GET['id'])) {
    //             $query = "DELETE FROM eleves WHERE id = :id";
    //             $stmt = $pdo->prepare($query);
    //             $stmt->bindParam(':id', $_GET['id']);
    //             if ($stmt->execute()) {
    //                 echo json_encode(["message" => "Élève supprimé avec succès"]);
    //             } else {
    //                 echo json_encode(["error" => "Erreur lors de la suppression de l'élève"]);
    //             }
    //         }
    //         break;
        
    //     default:
    //         echo json_encode(["message" => "Méthode non autorisée"]);
    // } 

    switch ($method) {
        case 'GET':
            if ($action == 'getEleves') {
                // var_dump($_GET);
                $anneeScolaireId = $_GET['annee_scolaire_id'];
                // $anneeScolaireId = isset($_GET['annee_scolaire_id']) ? intval($_GET['annee_scolaire_id']) : 0;

                
                $query = "SELECT e.*, c.nom_classe AS nom_classe 
                        FROM eleves e
                        JOIN classes c ON e.classe_id = c.id
                        WHERE e.annee_scolaire_id = ?";
                $stmt = $pdo->prepare($query);
                $stmt->execute([$anneeScolaireId]);
                $eleves = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($eleves);
            } elseif ($action === 'getEleveById') {
                // $id = $_GET['id'];
                $id = isset($_GET['id']) ? intval($_GET['id']) : 0;

                if ($id === 0) {
                    echo json_encode(["error" => "ID élève manquant ou invalide"]);
                    exit;
                }

                $query = "SELECT e.*, c.nom_classe AS nom_classe 
                          FROM eleves e
                          JOIN classes c ON e.classe_id = c.id
                          WHERE e.id = ?";
                $stmt = $pdo->prepare($query);
                $stmt->execute([$id]);
                $eleve = $stmt->fetch(PDO::FETCH_ASSOC);
                header('Content-Type: application/json');
                print_r($eleve);
                echo json_encode($eleve);
            } elseif ($action == 'getNombreElevesParClasse') {
                $anneeScolaireId = $_GET['annee_scolaire_id'];
        
                $query = "SELECT c.nom_classe, COUNT(e.id) AS nb_eleves
                          FROM eleves e
                          JOIN classes c ON e.classe_id = c.id
                          WHERE e.annee_scolaire_id = ?
                          GROUP BY c.nom_classe";
                
                $stmt = $pdo->prepare($query);
                $stmt->execute([$anneeScolaireId]);
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                
                echo json_encode($result);
            }
            break;
        
        case 'POST':
            // $data = json_decode(file_get_contents("php://input"), true);
    
            if ($action == 'ajouterEleve') {
                $data = json_decode(file_get_contents("php://input"), true);
                $query = "INSERT INTO eleves (prenom, nom, date_naissance, classe_id, groupe, nationalite, adresse, telephone, sexe, annee_scolaire_id) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                $stmt = $pdo->prepare($query);
                $stmt->execute([
                    $data['prenom'], $data['nom'], $data['date_naissance'], $data['classe_id'], 
                    $data['groupe'], $data['nationalite'], $data['adresse'], $data['telephone'], 
                    $data['sexe'], $data['annee_scolaire_id']
                ]);
                echo json_encode(["message" => "Élève ajouté avec succès"]);
            }
            break;
            
        case 'PUT':
            $data = json_decode(file_get_contents("php://input"), true);
            $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
    
            if ($action == 'modifierEleve') {
                $id = $_GET['id'];
                $data = json_decode(file_get_contents("php://input"), true);
                $query = "UPDATE eleves 
                        SET prenom = ?, nom = ?, date_naissance = ?, classe_id = ?, 
                            groupe = ?, nationalite = ?, adresse = ?, telephone = ?, sexe = ?, 
                            annee_scolaire_id = ? 
                        WHERE id = ?";
                $stmt = $pdo->prepare($query);
                $stmt->execute([
                    $data['prenom'], $data['nom'], $data['date_naissance'], $data['classe_id'], 
                    $data['groupe'], $data['nationalite'], $data['adresse'], $data['telephone'], 
                    $data['sexe'], $data['annee_scolaire_id'], $id
                ]);
                echo json_encode(["message" => "Élève modifié avec succès"]);
            }
            break;
        
        case 'DELETE':
            $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
    
            if ($action == 'supprimerEleve') {
                $id = $_GET['id'];
                $query = "DELETE FROM eleves WHERE id = ?";
                $stmt = $pdo->prepare($query);
                $stmt->execute([$id]);
                echo json_encode(["message" => "Élève supprimé avec succès"]);
            }
            break;
        
        default:
            echo json_encode(["message" => "Méthode non autorisée"]);
            exit;
    }
    


    // Pour les années scolaires
 /*

    $anneeScolaire = $_GET['anneeScolaire'] ?? '';
    // $anneeScolaire = explode('-', $_GET['anneeScolaire'])[0];
    $table = $_GET['table'] ?? '';
    // error_log("🔍 Requête reçue : Table = $table, Année = $anneeScolaire"); // Vérification

    // echo json_encode(["debug" => "Table = $table, Annee = $anneeScolaire"]); // Pour afficher dans le navigateur
    // exit;

    if (!in_array($table, ['eleves', 'enseignants', 'scolarites', 'classes', 'matieres', 'emargements', 'absences', 'emplois_temps', 'notes', 'users' ])) {
        echo json_encode(["error" => "Table inconnue"]);
        exit;
    }

    $sql = "SELECT * FROM $table WHERE annee_scolaire_id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$anneeScolaire]);
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);
*/

    // switch ($method) {
    //     case 'GET':
            
    //         if ($action === 'getAnneesScolaires') {
    //             $sql = "SELECT * FROM annees_scolaires ORDER BY id DESC";
    //             $result = $conn->query($sql);

    //             $annees = [];
    //             while ($row = $result->fetch_assoc()) {
    //                 $annees[] = $row;
    //             }

    //             echo json_encode($annees);
    //         }
    //         break;

    //     case 'POST':
    //         if ($action === 'ajouterAnneeScolaire') {
    //             $data = json_decode(file_get_contents("php://input"), true);

    //             if (!isset($data['annee'])) {
    //                 echo json_encode(["success" => false, "message" => "Données manquantes"]);
    //             } else {
    //                 $annee = $conn->real_escape_string($data['annee']);
    //                 $sql = "INSERT INTO annees_scolaires (annee) VALUES ('$annee')";

    //                 if ($conn->query($sql)) {
    //                     echo json_encode(["success" => true, "message" => "Année scolaire ajoutée"]);
    //                 } else {
    //                     echo json_encode(["success" => false, "message" => "Erreur lors de l'ajout"]);
    //                 }
    //             }
    //         }
    //         break;

    //     case 'POST':
    //         if ($action === 'getDonneesParAnnee') {
    //             $data = json_decode(file_get_contents("php://input"), true);

    //             if (!isset($data['anneeId'])) {
    //                 echo json_encode(["success" => false, "message" => "ID de l'année scolaire manquant"]);
    //             } else {
    //                 $anneeId = intval($data['anneeId']);

    //                 $tables = ['eleves', 'enseignants', 'scolarites', 'classes', 'matieres', 'emargements', 'absences', 'emplois_temps', 'notes', 'users'];
    //                 $resultats = [];

    //                 foreach ($tables as $table) {
    //                     $sql = "SELECT * FROM $table WHERE annee_scolaire_id = $anneeId";
    //                     $result = $conn->query($sql);

    //                     $data = [];
    //                     while ($row = $result->fetch_assoc()) {
    //                         $data[] = $row;
    //                     }

    //                     $resultats[$table] = $data;
    //                 }

    //                 echo json_encode($resultats);
    //             }
    //         }
    //         break;
    // }

    // Switch pour traiter les différentes requêtes
    switch ($method) {
        case 'GET':
            if ($action === 'getAnneesScolaires') {
                $sql = "SELECT * FROM annees_scolaires ORDER BY id DESC";
                $stmt = $pdo->query($sql);
                $annees = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($annees);
            }
            break;

        case 'POST':
            if ($action === 'ajouterAnneeScolaire') {
                $data = json_decode(file_get_contents("php://input"), true);
                error_log("Données reçues : " . json_encode($data));

                if (!isset($data['annee'])) {
                    error_log("Erreur : Données manquantes");
                    echo json_encode(["success" => false, "message" => "Données manquantes"]);
                } else {
                    $sql = "INSERT INTO annees_scolaires (annee) VALUES (:annee)";
                    $stmt = $pdo->prepare($sql);
                    $stmt->bindParam(':annee', $data['annee'], PDO::PARAM_STR);

                    if ($stmt->execute()) {
                        echo json_encode(["success" => true, "message" => "Année scolaire ajoutée"]);
                    } else {
                        echo json_encode(["success" => false, "message" => "Erreur lors de l'ajout"]);
                    }
                }
            }

            if ($action === 'getDonneesParAnnee') {
                $data = json_decode(file_get_contents("php://input"), true);

                if (!isset($data['anneeId'])) {
                    echo json_encode(["success" => false, "message" => "ID de l'année scolaire manquant"]);
                } else {
                    $anneeId = intval($data['anneeId']);
                    $tables = ['eleves', 'enseignants', 'scolarites', 'classes', 'matieres', 'emargements', 'absences', 'emplois_temps', 'notes', 'users'];
                    $resultats = [];

                    foreach ($tables as $table) {
                        $sql = "SELECT * FROM $table WHERE annee_scolaire_id = :anneeId";
                        $stmt = $pdo->prepare($sql);
                        $stmt->bindParam(':anneeId', $anneeId, PDO::PARAM_INT);
                        $stmt->execute();

                        $resultats[$table] = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    }

                    echo json_encode($resultats);
                }
            }
            break;
    }


    // Pour les Utilisateurs


    // if ($method == 'POST') {
    //     $data = json_decode(file_get_contents("php://input"), true);
    //     if (!$data) {
    //         echo json_encode(["message" => "Aucune donnée reçue", "input" => file_get_contents("php://input")]);
    //         exit;
    //     }
    //     $action = $_GET['action'] ?? '';
    
    //     if ($action == 'register') {
    //         $nom = $data['nom'] ?? '';
    //         $prenom = $data['prenom'] ?? '';
    //         $email = $data['email'] ?? '';
    //         $password = $data['password'] ?? '';
    //         $role = $data['role'] ?? 'eleve';
    
    //         if (!filter_var($email, FILTER_VALIDATE_EMAIL) || empty($password)) {
    //             echo json_encode(["message" => "Données invalides"]);
    //             exit;
    //         }
    
    //         $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    
    //         $query = $pdo->prepare("INSERT INTO users (nom, prenom, email, password, role) VALUES (?, ?, ?, ?, ?)");
    //         if ($query->execute([$nom, $prenom, $email, $hashedPassword, $role])) {
    //             echo json_encode(["message" => "Utilisateur inscrit"]);
    //         } else {
    //             $errorInfo = $query->errorInfo();
    //             echo json_encode(["message" => "Erreur lors de l'inscription"]);
    //         }
    //     } 
        
    //     elseif ($action == 'login') {
    //         $email = $data['email'] ?? '';
    //         $password = $data['password'] ?? '';
    
    //         $query = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    //         $query->execute([$email]);
    //         $user = $query->fetch(PDO::FETCH_ASSOC);


    //         if (!$user) {
    //             echo json_encode(["message" => "Utilisateur non trouvé"]);
    //             exit;
    //         }
            
    //         //var_dump($user); // 🔍 Vérifie que l'utilisateur est bien récupéré
            
    //         //var_dump($password, $user['password']); // 🔍 Vérifie les valeurs
    //         if ($user && password_verify($password, $user['password'])) {
    //             $payload = [
    //                 "id" => $user['id'],
    //                 "email" => $user['email'],
    //                 "role" => $user['role'],
    //                 "exp" => time() + (60 * 60)
    //             ];
    //             $jwt = JWT::encode($payload, $secret_key, 'HS256');
    //             //var_dump($jwt);
    
    //             echo json_encode(["message" => "Connexion réussie", "token" => $jwt, "user" => $user]);

    //             // Ajout de logs pour le debug
    //             error_log("Connexion réussie pour : " . $user['email']);
    //         } else {
    //             echo json_encode(["message" => "Identifiants incorrects"]);
    //         }

    //         error_log(json_encode([
    //             "message" => "Connexion réussie",
    //             "token" => $jwt,
    //             "user" => $user
    //         ]));        


    //         // $testPassword = "123456";
    //         // $hashed = password_hash($testPassword, PASSWORD_BCRYPT);

    //         // echo "Test hash: " . $hashed . "\n";
    //         // echo password_verify($testPassword, $hashed) ? "Mot de passe vérifié" : "Erreur de vérification";
    //         }
    // }

    switch ($method) {
        case 'GET':
            if ($action == 'getUsers') {
                $anneeScolaireId = $_GET['annee_scolaire_id'] ?? 0;
    
                $query = "SELECT * FROM users WHERE annee_scolaire_id = ?";
                $stmt = $pdo->prepare($query);
                $stmt->execute([$anneeScolaireId]);
                $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
                echo json_encode($users);
            }
            break;
    
        case 'POST':
            $data = json_decode(file_get_contents("php://input"), true);
            if (!$data) {
                echo json_encode(["message" => "Aucune donnée reçue", "input" => file_get_contents("php://input")]);
                exit;
            }
            $action = $_GET['action'] ?? '';
    
            if ($action == 'register') {
                $nom = $data['nom'] ?? '';
                $prenom = $data['prenom'] ?? '';
                $email = $data['email'] ?? '';
                $password = $data['password'] ?? '';
                // $role = $data['role'] ?? 'eleve';
                $role = isset($data['role']) && in_array($data['role'], ['admin', 'enseignant', 'eleve']) ? $data['role'] : 'admin';

                $anneeScolaireId = $data['annee_scolaire_id'] ?? 0;
    
                if (!filter_var($email, FILTER_VALIDATE_EMAIL) || empty($password) || $anneeScolaireId == 0) {
                    echo json_encode(["message" => "Données invalides"]);
                    exit;
                }
    
                $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    
                $query = $pdo->prepare("INSERT INTO users (nom, prenom, email, password, role, annee_scolaire_id) VALUES (?, ?, ?, ?, ?, ?)");
                if ($query->execute([$nom, $prenom, $email, $hashedPassword, $role, $anneeScolaireId])) {
                    echo json_encode(["message" => "Utilisateur inscrit"]);
                } else {
                    echo json_encode(["message" => "Erreur lors de l'inscription"]);
                }
            } 
            
            elseif ($action == 'login') {
                $email = $data['email'] ?? '';
                $password = $data['password'] ?? '';
    
                $query = $pdo->prepare("SELECT * FROM users WHERE email = ?");
                $query->execute([$email]);
                $user = $query->fetch(PDO::FETCH_ASSOC);
    
                if (!$user) {
                    echo json_encode(["message" => "Utilisateur non trouvé"]);
                    exit;
                }
    
                if (password_verify($password, $user['password'])) {
                    $payload = [
                        "id" => $user['id'],
                        "email" => $user['email'],
                        "role" => $user['role'],
                        "annee_scolaire_id" => $user['annee_scolaire_id'],
                        "exp" => time() + (60 * 60) // Expiration après 1 heure
                    ];
                    $jwt = JWT::encode($payload, $secret_key, 'HS256');
    
                    echo json_encode(["message" => "Connexion réussie", "token" => $jwt, "user" => $user]);
                } else {
                    echo json_encode(["message" => "Identifiants incorrects"]);
                }
            }
            break;
    
        case 'PUT':
            $data = json_decode(file_get_contents("php://input"), true);
            $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
    
            if ($action == 'modifierUser') {
                $query = "UPDATE users SET nom = ?, prenom = ?, email = ?, role = ?, annee_scolaire_id = ? WHERE id = ?";
                $stmt = $pdo->prepare($query);
                $stmt->execute([
                    $data['nom'], $data['prenom'], $data['email'], $data['role'], 
                    $data['annee_scolaire_id'], $id
                ]);
                echo json_encode(["message" => "Utilisateur modifié avec succès"]);
            }
            break;
    
        case 'DELETE':
            $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
    
            if ($action == 'supprimerUser') {
                $query = "DELETE FROM users WHERE id = ?";
                $stmt = $pdo->prepare($query);
                $stmt->execute([$id]);
                echo json_encode(["message" => "Utilisateur supprimé avec succès"]);
            }
            break;
    
        default:
            echo json_encode(["message" => "Méthode non autorisée"]);
            exit;
    }
    


    // Pour les statistiques


    switch($method) {
        case 'GET':
            if ($action == 'getAdminStats') {
                $anneeScolaireId = $_GET['annee_scolaire_id'];
                
        
                // 🔹 Récupérer le total des élèves
                $queryEleves = "SELECT COUNT(*) AS totalEleves FROM eleves WHERE annee_scolaire_id = ?";
                $stmt = $pdo->prepare($queryEleves);
                $stmt->execute([$anneeScolaireId]);
                $totalEleves = $stmt->fetch(PDO::FETCH_ASSOC)['totalEleves'];
        
                // 🔹 Récupérer le total des enseignants
                $queryEnseignants = "SELECT COUNT(*) AS totalEnseignants FROM enseignants WHERE annee_scolaire_id = ?";
                $stmt = $pdo->prepare($queryEnseignants);
                $stmt->execute([$anneeScolaireId]);
                $totalEnseignants = $stmt->fetch(PDO::FETCH_ASSOC)['totalEnseignants'];
        
                // 🔹 Récupérer le total des paiements
                $queryPaiements = "SELECT SUM(montant_paye) AS totalPaiements FROM scolarites WHERE annee_scolaire_id = ?";
                $stmt = $pdo->prepare($queryPaiements);
                $stmt->execute([$anneeScolaireId]);
                $totalPaiements = $stmt->fetch(PDO::FETCH_ASSOC)['totalPaiements'] ?? 0;
        
                // 🔹 Récupérer le total des absences
                $queryAbsences = "SELECT COUNT(*) AS totalAbsences FROM absences WHERE annee_scolaire_id = ?";
                $stmt = $pdo->prepare($queryAbsences);
                $stmt->execute([$anneeScolaireId]);
                $totalAbsences = $stmt->fetch(PDO::FETCH_ASSOC)['totalAbsences'];
        
                // 🔹 Réponse JSON
                echo json_encode([
                    "totalEleves" => $totalEleves,
                    "totalEnseignants" => $totalEnseignants,
                    "totalPaiements" => $totalPaiements,
                    "totalAbsences" => $totalAbsences
                ]);
            } elseif ($action == 'getEleveStats') {
                // $jour = date('l');
                $jours = [
                    'Sunday' => 'Dimanche',
                    'Monday' => 'Lundi',
                    'Tuesday' => 'Mardi',
                    'Wednesday' => 'Mercredi',
                    'Thursday' => 'Jeudi',
                    'Friday' => 'Vendredi',
                    'Saturday' => 'Samedi'
                ];
                $jourAnglais = date('l');
                $jour = $jours[$jourAnglais];
                $anneeScolaireId = $_GET['annee_scolaire_id'];
            
                // 🔹 Emploi du temps
                $query1 = "SELECT e.*, c.nom_classe, m.nom AS matiere_nom
                           FROM emplois_temps e
                           JOIN classes c ON e.classe_id = c.id
                           JOIN matieres m ON e.matiere_id = m.id
                        --    JOIN enseignants ens ON m.enseignant_id = ens.id
                           WHERE e.jour = ? AND e.annee_scolaire_id = ?
                           ORDER BY c.nom_classe, e.heure";
                $stmt1 = $pdo->prepare($query1);
                $stmt1->execute([$jour, $anneeScolaireId]);
                $emploiDuTemps = $stmt1->fetchAll(PDO::FETCH_ASSOC);
            
                // 🔹 Meilleures moyennes
                $query2 = "SELECT e.id AS eleve_id, e.nom, e.prenom, c.nom_classe,
                                  ROUND(SUM(((n.devoir1 + n.devoir2 + n.composition)/3) * n.coefficient) / SUM(n.coefficient), 2) AS moyenne
                           FROM notes n
                           JOIN eleves e ON n.eleve_id = e.id
                           JOIN classes c ON n.classe_id = c.id
                           WHERE n.annee_scolaire_id = ?
                           GROUP BY n.eleve_id, c.nom_classe
                           ORDER BY c.nom_classe ASC, moyenne DESC";
                $stmt2 = $pdo->prepare($query2);
                $stmt2->execute([$anneeScolaireId]);
                $eleves = $stmt2->fetchAll(PDO::FETCH_ASSOC);
            
                $topParClasse = [];
                foreach ($eleves as $eleve) {
                    $classe = $eleve['nom_classe'];
                    if (!isset($topParClasse[$classe])) {
                        $topParClasse[$classe] = $eleve;
                    }
                }
            
                // 🔹 Total absences
                $query3 = "SELECT COUNT(*) as total FROM absences WHERE annee_scolaire_id = ?";
                $stmt3 = $pdo->prepare($query3);
                $stmt3->execute([$anneeScolaireId]);
                $totalAbsences = $stmt3->fetch(PDO::FETCH_ASSOC);
            
                // 🔹 Retourner tout dans un seul JSON
                echo json_encode([
                    "emploiDuTemps" => $emploiDuTemps,
                    "meilleuresMoyennes" => array_values($topParClasse),
                    "totalAbsences" => $totalAbsences['total']
                ]);

                error_log("Appel à getEleveStats avec année: $anneeScolaireId et jour: $jour");
                error_log("Emploi: " . count($emploiDuTemps));
                error_log("Top Moyennes: " . count($topParClasse));
                error_log("Absences: " . json_encode($totalAbsences));
            } 
            /*elseif ($action == 'getEnseignantStats') {
                //$anneeScolaireId = $_GET['annee_scolaire_id'];
                
                $anneeScolaireId = $_GET['annee_scolaire_id'];

                $jours = [
                    'Sunday' => 'Dimanche',
                    'Monday' => 'Lundi',
                    'Tuesday' => 'Mardi',
                    'Wednesday' => 'Mercredi',
                    'Thursday' => 'Jeudi',
                    'Friday' => 'Vendredi',
                    'Saturday' => 'Samedi'
                ];
                $jourAnglais = date('l');
                $jour = $jours[$jourAnglais];
        
                // 🔹 Emploi du temps
                $query1 = "SELECT e.*, c.nom_classe, m.nom AS matiere_nom
                           FROM emplois_temps e
                           JOIN classes c ON e.classe_id = c.id
                           JOIN matieres m ON e.matiere_id = m.id
                           WHERE e.annee_scolaire_id = ?";
                $stmt1 = $pdo->prepare($query1);
                $stmt1->execute([$anneeScolaireId]);
                $emploiDuTemps = $stmt1->fetchAll(PDO::FETCH_ASSOC);
        
                // 🔹 Classes des enseignants
                $query2 = "SELECT DISTINCT c.nom_classe
                           FROM enseignants en
                           JOIN enseignants_classes ec ON en.id = ec.enseignant_id
                           JOIN classes c ON en.classe_id = c.id
                           WHERE en.annee_scolaire_id = ?";

                
                $stmt2 = $pdo->prepare($query2);
                $stmt2->execute([$anneeScolaireId]);
                $classes = $stmt2->fetchAll(PDO::FETCH_ASSOC);
        
                // 🔹 Absences des enseignants
                $query3 = "SELECT e.nom, e.prenom, COUNT(a.id) AS total_absences
                           FROM absences a
                           JOIN enseignants e ON a.enseignant_id = e.id
                           WHERE a.annee_scolaire_id = ?
                           GROUP BY e.id";
                $stmt3 = $pdo->prepare($query3);
                $stmt3->execute([$anneeScolaireId]);
                $absences = $stmt3->fetchAll(PDO::FETCH_ASSOC);
        
                // Retourner les données
                echo json_encode([
                    'emploiDuTemps' => $emploiDuTemps,
                    'classes' => $classes,
                    'absences' => $absences
                ]);
            }*/
            elseif ($action == 'getEnseignantStats') {

                $anneeScolaireId = $_GET['annee_scolaire_id'];
            
                $jours = [
                    'Sunday' => 'Dimanche',
                    'Monday' => 'Lundi',
                    'Tuesday' => 'Mardi',
                    'Wednesday' => 'Mercredi',
                    'Thursday' => 'Jeudi',
                    'Friday' => 'Vendredi',
                    'Saturday' => 'Samedi'
                ];
                $jourAnglais = date('l');
                $jour = $jours[$jourAnglais];
            
                // 🔹 Emploi du temps
                $query1 = "SELECT e.*, c.nom_classe, m.nom AS matiere_nom
                           FROM emplois_temps e
                           JOIN classes c ON e.classe_id = c.id
                           JOIN matieres m ON e.matiere_id = m.id
                           WHERE e.annee_scolaire_id = ?";
                $stmt1 = $pdo->prepare($query1);
                $stmt1->execute([$anneeScolaireId]);
                $emploiDuTemps = $stmt1->fetchAll(PDO::FETCH_ASSOC);
            
                // 🔹 Absences des enseignants
                $query3 = "SELECT e.nom, e.prenom, COUNT(a.id) AS total_absences
                           FROM absences a
                           JOIN enseignants e ON a.enseignant_id = e.id
                           WHERE a.annee_scolaire_id = ?
                           GROUP BY e.id";
                $stmt3 = $pdo->prepare($query3);
                $stmt3->execute([$anneeScolaireId]);
                $absences = $stmt3->fetchAll(PDO::FETCH_ASSOC);
            
                // ✅ Réponse finale
                echo json_encode([
                    'emploiDuTemps' => $emploiDuTemps,
                    'classes' => [], // ou supprime cette ligne
                    'absences' => $absences
                ]);
            }

            
            break;
        
        

    }




    //Pour les classes

    // switch ($method) {
    //     case 'GET':
    //         if ($action == 'getClasses') {
    //             $query = "SELECT * FROM classes";
    //             $stmt = $pdo->prepare($query);
    //             $stmt->execute();
    //             $classes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    //             echo json_encode($classes);
    //         } elseif ($action == 'getClasseById' && isset($_GET['id'])) {
    //             $query = "SELECT * FROM classes WHERE id = :id";
    //             $stmt = $pdo->prepare($query);
    //             $stmt->execute(['id' => $_GET['id']]);
    //             $classe = $stmt->fetch(PDO::FETCH_ASSOC);
    //             echo json_encode($classe);
    //         }
    //         break;
    
    //     case 'POST':
    //         if ($action == 'ajouterClasse') {
    //             $data = json_decode(file_get_contents("php://input"), true);
    //             if (!isset($data['nom_classe']) || empty($data['nom_classe'])) {
    //                 echo json_encode(["error" => "Le nom de la classe est requis"]);
    //                 exit;
    //             }
    //             $query = "INSERT INTO classes (nom_classe, description) VALUES (:nom_classe, :description)";
    //             $stmt = $pdo->prepare($query);
    //             if ($stmt->execute([
    //                 'nom_classe' => $data['nom_classe'],
    //                 'description' => $data['description'] ?? null
    //             ])) {
    //                 echo json_encode(["message" => "Classe ajoutée avec succès"]);
    //             } else {
    //                 echo json_encode(["error" => "Erreur lors de l'ajout de la classe"]);
    //             }
    //         }
    //         break;
    
    //     case 'PUT':
    //         if ($action == 'modifierClasse' && isset($_GET['id'])) {
    //             $data = json_decode(file_get_contents("php://input"), true);
    //             $query = "UPDATE classes SET nom_classe = :nom_classe, description = :description WHERE id = :id";
    //             $stmt = $pdo->prepare($query);
    //             if ($stmt->execute([
    //                 'nom_classe' => $data['nom_classe'],
    //                 'description' => $data['description'],
    //                 'id' => $_GET['id']
    //             ])) {
    //                 echo json_encode(["message" => "Classe modifiée avec succès"]);
    //             } else {
    //                 echo json_encode(["error" => "Erreur lors de la modification"]);
    //             }
    //         }
    //         break;
    
    //     case 'DELETE':
    //         if ($action == 'supprimerClasse' && isset($_GET['id'])) {
    //             $query = "DELETE FROM classes WHERE id = :id";
    //             $stmt = $pdo->prepare($query);
    //             if ($stmt->execute(['id' => $_GET['id']])) {
    //                 echo json_encode(["message" => "Classe supprimée avec succès"]);
    //             } else {
    //                 echo json_encode(["error" => "Erreur lors de la suppression"]);
    //             }
    //         }
    //         break;
    
    //     default:
    //         echo json_encode(["error" => "Méthode non supportée"]);
    // } 

    switch ($method) {
        case 'GET':
            if ($action === 'getClasses') {
                if (!isset($_GET['annee_scolaire_id'])) {
                    echo json_encode(["error" => "L'identifiant de l'année scolaire est requis."]);
                    exit;
                }
                $anneeId = intval($_GET['annee_scolaire_id']);
                $stmt = $pdo->prepare("SELECT * FROM classes WHERE annee_scolaire_id = ?");
                $stmt->execute([$anneeId]);
                echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            } elseif ($action === 'getClasseById') {
                $id = intval($_GET['id']);
                $stmt = $pdo->prepare("SELECT * FROM classes WHERE id = ?");
                $stmt->execute([$id]);
                echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
            }
            break;
    
        case 'POST':
            if ($action === 'ajouterClasse') {
                $data = json_decode(file_get_contents("php://input"), true);
                $nom = $data['nom_classe'];
                $anneeId = intval($data['annee_scolaire_id']);
    
                $stmt = $pdo->prepare("INSERT INTO classes (nom_classe, annee_scolaire_id) VALUES (?, ?)");
                $stmt->execute([$nom, $anneeId]);
    
                echo json_encode(["success" => true, "id" => $pdo->lastInsertId()]);
            }
            break;
    
        case 'PUT':
            if ($action === 'modifierClasse') {
                $data = json_decode(file_get_contents("php://input"), true);
                $id = intval($_GET['id']);
                $nom = $data['nom_classe'];
    
                $stmt = $pdo->prepare("UPDATE classes SET nom_classe = ? WHERE id = ?");
                $stmt->execute([$nom, $id]);
    
                echo json_encode(["success" => true]);
            }
            break;
    
        case 'DELETE':
            if ($action === 'supprimerClasse') {
                $id = intval($_GET['id']);
                $stmt = $pdo->prepare("DELETE FROM classes WHERE id = ?");
                $stmt->execute([$id]);
    
                echo json_encode(["success" => true]);
            }
            break;
    }


    // Pour Les Matières sur le backend

    switch ($method) {
        case 'GET':
            if ($action == 'getMatieres') {
                $anneeScolaireId = $_GET['annee_scolaire_id'];
                $query = "SELECT * FROM matieres WHERE annee_scolaire_id = ?";
                $stmt = $pdo->prepare($query);
                $stmt->execute([$anneeScolaireId]);
                $matieres = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($matieres);
            } elseif ($action == 'getMatiereById') {
                $id = $_GET['id'];
                $query = "SELECT * FROM matieres WHERE id = ?";
                $stmt = $pdo->prepare($query);
                $stmt->execute([$id]);
                $matiere = $stmt->fetch(PDO::FETCH_ASSOC);
                echo json_encode($matiere);
            }
            break;
    
        case 'POST':
            if ($action == 'ajouterMatiere') {
                 $data = json_decode(file_get_contents("php://input"), true);
                $query = "INSERT INTO matieres (nom, description, annee_scolaire_id) VALUES (?, ?, ?)";
                $stmt = $pdo->prepare($query);
                $stmt->execute([$data['nom'], $data['description'], $data['annee_scolaire_id']]);
                echo json_encode(["message" => "Matière ajoutée avec succès"]);
            }
            break;
    
        case 'PUT':
            // if ($action == 'modifierMatiere') {
            //     $id = $_GET['id'];
            //     $data = json_decode(file_get_contents("php://input"), true);
            //     $query = "UPDATE matieres SET nom = ?, description = ? WHERE id = ?";
            //     $stmt = $pdo->prepare($query);
            //     $stmt->execute([$data['nom'], $data['description'], $id]);
            //     echo json_encode(["message" => "Matière modifiée avec succès"]);
            // }

            if ($action == 'modifierMatiere') {
                $id = $_GET['id'] ?? null;
                $data = json_decode(file_get_contents("php://input"), true);
        
                if (!$id || !$data) {
                    echo json_encode(["error" => "ID ou données manquantes"]);
                    exit;
                }
        
                // Debug: Vérifier ce qui est reçu côté backend
                file_put_contents('log.txt', print_r($data, true)); 
        
                $query = "UPDATE matieres SET nom = ?, description = ?, annee_scolaire_id = ? WHERE id = ?";
                $stmt = $pdo->prepare($query);
                $stmt->execute([$data['nom'], $data['description'], $data['annee_scolaire_id'], $id]);
        
                echo json_encode(["message" => "Matière modifiée avec succès"]);
                exit;
            }
            break;
    
        case 'DELETE':
            if ($action == 'supprimerMatiere') {
                $id = $_GET['id'];
                $query = "DELETE FROM matieres WHERE id = ?";
                $stmt = $pdo->prepare($query);
                $stmt->execute([$id]);
                echo json_encode(["message" => "Matière supprimée avec succès"]);
            }
            break;
    
        default:
            echo json_encode(["error" => "Méthode non supportée"]);
    }




    // Pour les Enseignant 



    // switch ($method) {
    //     case 'GET':
    //         if ($action == 'getEnseignants') {
    //             $query = "SELECT * FROM enseignants";
    //             $stmt = $pdo->prepare($query);
    //             $stmt->execute();
    //             echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    //         } elseif ($action == 'getEnseignant' && isset($_GET['id'])) {
    //             $query = "SELECT * FROM enseignants WHERE id = :id";
    //             $stmt = $pdo->prepare($query);
    //             $stmt->execute(['id' => $_GET['id']]);
    //             echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
    //         }
    //         break;
    
    //     case 'POST':
    //         if ($action == 'ajouterEnseignant') {
    //             $prenom = $_POST['prenom'];
    //             $nom = $_POST['nom'];
    //             $date_naissance = $_POST['date_naissance'];
    //             $lieu_naissance = $_POST['lieu_naissance'];
    //             $telephone = $_POST['telephone'];
    //             $profession = $_POST['profession'];
    //             $photo = '';
    
    //             if (!empty($_FILES['photo']['name'])) {
    //                 $target_dir = "uploads/";
    //                 if (!file_exists($target_dir)) {
    //                     mkdir($target_dir, 0777, true); // Crée le dossier si inexistant
    //                 }
    //                 $photo = $target_dir . basename($_FILES["photo"]["name"]);
    //                 // move_uploaded_file($_FILES["photo"]["tmp_name"], $photo);
                    
    //                 if (move_uploaded_file($_FILES["photo"]["tmp_name"], $photo)) {
    //                     // echo json_encode(["message" => "Enseignant ajouté avec succès", "photo" => $photo]);
    //                 } else {
    //                     echo json_encode(["error" => "Erreur lors de l'upload du fichier"]);
    //                 }
    //             }else {
    //                 $photo = "Aucune photo reçue";
    //             }
    //             file_put_contents("debug.txt", print_r($_POST, true));
    //             file_put_contents("debug.txt", "Photo: $photo\n", FILE_APPEND);
    
    //             $query = "INSERT INTO enseignants (prenom, nom, date_naissance, lieu_naissance, telephone, profession, photo) 
    //                     VALUES (:prenom, :nom, :date_naissance, :lieu_naissance, :telephone, :profession, :photo)";
    //             $stmt = $pdo->prepare($query);
    //             $stmt->execute([
    //                 "prenom" => $prenom,
    //                 "nom" => $nom,
    //                 "date_naissance" => $date_naissance,
    //                 "lieu_naissance" => $lieu_naissance,
    //                 "telephone" => $telephone,
    //                 "profession" => $profession,
    //                 "photo" => $photo
    //             ]);
    
    //             echo json_encode(["message" => "Enseignant ajouté avec succès", "photo" => $photo]);
    //         }
    //         break;
    
    //         case 'PUT':
    //             if ($action == 'modifierEnseignant') {
    //                 $data = json_decode(file_get_contents("php://input"), true);
    //                 file_put_contents("debug_log.txt", print_r($data, true), FILE_APPEND);
            
    //                 if (!$data || !isset($data['id'])) {
    //                     echo json_encode(["error" => "Données manquantes"]);
    //                     exit;
    //                 }
            
    //                 $id = $data['id'];
    //                 $prenom = $data['prenom'];
    //                 $nom = $data['nom'];
    //                 $date_naissance = $data['date_naissance'];
    //                 $lieu_naissance = $data['lieu_naissance'];
    //                 $telephone = $data['telephone'];
    //                 $profession = $data['profession'];
            
    //                 $photo = "";
    //                 // Récupérer la photo si elle est envoyée
    //                 if (!empty($_FILES['photo']['name'])) {
    //                     $photo = 'uploads/' . basename($_FILES['photo']['name']);

    //                     // Redimensionner l'image
    //                     list($width, $height) = getimagesize($_FILES['photo']['tmp_name']);
    //                     $newWidth = 200;  // Largeur souhaitée
    //                     $newHeight = (int)($height * ($newWidth / $width));

    //                     // Créer une image redimensionnée
    //                     $image = imagecreatefrompng($_FILES['photo']['tmp_name']);
    //                     $resizedImage = imagescale($image, $newWidth, $newHeight);

    //                     // Sauvegarder l'image redimensionnée
    //                     imagepng($resizedImage, $targetFilePath);
    //                     imagedestroy($image);
    //                     imagedestroy($resizedImage);

    //                     move_uploaded_file($_FILES['photo']['tmp_name'], $photo);
    //                 } else {
    //                     // Si pas de photo, récupérer l'ancienne photo depuis la base de données
    //                     $query = "SELECT photo FROM enseignants WHERE id=:id";
    //                     $stmt = $pdo->prepare($query);
    //                     $stmt->execute(["id" => $id]);
    //                     if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    //                         $photo = $row['photo'];
    //                     }
    //                 }
            
    //                 // Mettre à jour les données
    //                 $updateQuery = "UPDATE enseignants SET prenom=:prenom, nom=:nom, date_naissance=:date_naissance, lieu_naissance=:lieu_naissance, telephone=:telephone, profession=:profession, photo=:photo WHERE id=:id";
    //                 $stmt = $pdo->prepare($updateQuery);
    //                 $success = $stmt->execute([
    //                     "prenom" => $prenom,
    //                     "nom" => $nom,
    //                     "date_naissance" => $date_naissance,
    //                     "lieu_naissance" => $lieu_naissance,
    //                     "telephone" => $telephone,
    //                     "profession" => $profession,
    //                     "photo" => $photo,
    //                     "id" => $id
    //                 ]);
            
    //                 if ($success) {
    //                     echo json_encode(["message" => "Modification réussie", "photo" => $photo]);
    //                 } else {
    //                     echo json_encode(["error" => "Erreur lors de la mise à jour"]);
    //                 }

    //                 error_log('Données reçues: ' . print_r($_POST, true));
    //                 error_log('Fichier photo: ' . print_r($_FILES, true));  

    //                 if ($updateSuccessful) {
    //                     $response = ['status' => 'success', 'message' => 'Enseignant modifié avec succès'];
    //                     echo json_encode($response);
    //                 } else {
    //                     $response = ['status' => 'error', 'message' => 'Erreur lors de la modification'];
    //                     echo json_encode($response);
    //                 }
                    
    //                 exit;
    //             }
    //             break;
    
        
    //         case 'DELETE':
    //             if ($action == 'supprimerEnseignant' && isset($_GET['id'])) {
    //                 $query = "DELETE FROM enseignants WHERE id = :id";
    //                 $stmt = $pdo->prepare($query);
    //                 $stmt->execute(['id' => $_GET['id']]);
    //                 echo json_encode(["message" => "Enseignant supprimé avec succès"]);
    //             }
    //             break;
    
    //         default:
    //             echo json_encode(["error" => "Méthode non supportée"]);
    // }

    // switch ($method) {
    //     case 'GET':
    //         if ($action == 'getEnseignants') {
    //             // Récupérer tous les enseignants pour une année scolaire donnée
    //             $annee_scolaire_id = $_GET['annee_scolaire_id'] ?? null;
    
    //             if ($annee_scolaire_id) {
    //                 $query = "SELECT * FROM enseignants WHERE annee_scolaire_id = :annee_scolaire_id";
    //                 $stmt = $pdo->prepare($query);
    //                 $stmt->execute(['annee_scolaire_id' => $annee_scolaire_id]);
    //                 $enseignants = $stmt->fetchAll(PDO::FETCH_ASSOC);
    //                 echo json_encode($enseignants);
    //             } else {
    //                 echo json_encode(['error' => 'L\'année scolaire est requise']);
    //             }
    //         } elseif ($action == 'getEnseignantById') {
    //             // Récupérer un enseignant par ID
    //             $id = $_GET['id'] ?? null;
    //             if ($id) {
    //                 $query = "SELECT * FROM enseignants WHERE id = ?";
    //                 $stmt = $pdo->prepare($query);
    //                 $stmt->execute([$id]);
    //                 $enseignant = $stmt->fetch(PDO::FETCH_ASSOC);
    //                 echo json_encode($enseignant);
    //             } else {
    //                 echo json_encode(['error' => 'ID non spécifié']);
    //             }
    //         }
    //         break;
    
    //     case 'POST':
    //         if ($action == 'ajouterEnseignant') {
    //             $data = json_decode(file_get_contents("php://input"), true);
    //             if (!$data) {
    //                 $data = $_POST; // Essaye avec $_POST si json_decode échoue
    //             }
    //             // Ajouter un nouvel enseignant
    //             $prenom = $_POST['prenom'] ?? '';
    //             $nom = $_POST['nom'] ?? '';
    //             $date_naissance = $_POST['date_naissance'] ?? null;
    //             $lieu_naissance = $_POST['lieu_naissance'] ?? '';
    //             $telephone = $_POST['telephone'] ?? '';
    //             $profession = $_POST['profession'] ?? '';
    //             $annee_scolaire_id = $_POST['annee_scolaire_id'] ?? null;
    //             $photo = '';
    
    //             if (!$annee_scolaire_id) {
    //                 echo json_encode(['error' => 'L\'année scolaire est obligatoire']);
    //                 exit;
    //             }
    
    //             // Gestion de l'upload de la photo
    //             /*if (!empty($_FILES['photo']['name'])) {
    //                 $target_dir = "uploads/";
    //                 if (!file_exists($target_dir)) {
    //                     mkdir($target_dir, 0777, true);
    //                 }
    //                 $photo = $target_dir . basename($_FILES["photo"]["name"]);
    //                 move_uploaded_file($_FILES["photo"]["tmp_name"], $photo);
    //             }*/

    //             if (!empty($_FILES['photo']['name'])) {
    //                 $target_dir = "uploads/";
    //                 if (!file_exists($target_dir)) {
    //                     mkdir($target_dir, 0777, true); // Crée le dossier si inexistant
    //                 }
    //                 $photo = $target_dir . basename($_FILES["photo"]["name"]);
    //                 // move_uploaded_file($_FILES["photo"]["tmp_name"], $photo);
                    
    //                 if (move_uploaded_file($_FILES["photo"]["tmp_name"], $photo)) {
    //                     // echo json_encode(["message" => "Enseignant ajouté avec succès", "photo" => $photo]);
    //                 } else {
    //                     echo json_encode(["error" => "Erreur lors de l'upload du fichier"]);
    //                 }
    //             }else {
    //                 $photo = "Aucune photo reçue";
    //             }

    //             // Journalisation des données reçues
    //             file_put_contents("debug.log", "GET DATA: " . print_r($_GET, true) . PHP_EOL, FILE_APPEND);
    //             file_put_contents("debug.log", "POST DATA: " . print_r($_POST, true) . PHP_EOL, FILE_APPEND);
    //             file_put_contents("debug.log", "FILES DATA: " . print_r($_FILES, true) . PHP_EOL, FILE_APPEND);
    
    //             $query = "INSERT INTO enseignants (prenom, nom, date_naissance, lieu_naissance, telephone, profession, photo, annee_scolaire_id) 
    //                       VALUES (:prenom, :nom, :date_naissance, :lieu_naissance, :telephone, :profession, :photo, :annee_scolaire_id)";
    //             $stmt = $pdo->prepare($query);
    //             $stmt->execute([
    //                 "prenom" => $prenom,
    //                 "nom" => $nom,
    //                 "date_naissance" => $date_naissance,
    //                 "lieu_naissance" => $lieu_naissance,
    //                 "telephone" => $telephone,
    //                 "profession" => $profession,
    //                 "photo" => $photo,
    //                 "annee_scolaire_id" => $annee_scolaire_id
    //             ]);
    //             $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    //             echo json_encode(["message" => "Enseignant ajouté avec succès", "photo" => $photo]);
    //         }
    //         break;
    
    //     case 'PUT':
    //         if ($action == 'modifierEnseignant') {
    //             // Modifier un enseignant
    //             $data = json_decode(file_get_contents("php://input"), true);
    
    //             if (!$data || !isset($data['id'])) {
    //                 echo json_encode(["error" => "ID non spécifié"]);
    //                 exit;
    //             }
    
    //             $id = $data['id'];
    //             $prenom = $data['prenom'] ?? '';
    //             $nom = $data['nom'] ?? '';
    //             $date_naissance = $data['date_naissance'] ?? null;
    //             $lieu_naissance = $data['lieu_naissance'] ?? '';
    //             $telephone = $data['telephone'] ?? '';
    //             $profession = $data['profession'] ?? '';
    //             $annee_scolaire_id = $data['annee_scolaire_id'] ?? null;
    //             $photo = '';
    
    //             if (!$annee_scolaire_id) {
    //                 echo json_encode(['error' => 'L\'année scolaire est obligatoire']);
    //                 exit;
    //             }
    
    //             // Gestion de l'upload de la photo
    //             if (!empty($_FILES['photo']['name'])) {
    //                 $target_dir = "uploads/";
    //                 if (!file_exists($target_dir)) {
    //                     mkdir($target_dir, 0777, true);
    //                 }
    //                 $photo = $target_dir . basename($_FILES["photo"]["name"]);
    //                 move_uploaded_file($_FILES["photo"]["tmp_name"], $photo);
    //             } else {
    //                 $query = "SELECT photo FROM enseignants WHERE id = :id";
    //                 $stmt = $pdo->prepare($query);
    //                 $stmt->execute(['id' => $id]);
    //                 $result = $stmt->fetch(PDO::FETCH_ASSOC);
    //                 $photo = $result['photo'] ?? '';
    //             }
    
    //             $query = "UPDATE enseignants SET prenom = :prenom, nom = :nom, date_naissance = :date_naissance, 
    //                       lieu_naissance = :lieu_naissance, telephone = :telephone, profession = :profession, 
    //                       photo = :photo, annee_scolaire_id = :annee_scolaire_id WHERE id = :id";
    //             $stmt = $pdo->prepare($query);
    //             $stmt->execute([
    //                 "prenom" => $prenom,
    //                 "nom" => $nom,
    //                 "date_naissance" => $date_naissance,
    //                 "lieu_naissance" => $lieu_naissance,
    //                 "telephone" => $telephone,
    //                 "profession" => $profession,
    //                 "photo" => $photo,
    //                 "annee_scolaire_id" => $annee_scolaire_id,
    //                 "id" => $id
    //             ]);
    
    //             echo json_encode(["message" => "Enseignant modifié avec succès", "photo" => $photo]);
    //         }
    //         break;
    
    //     case 'DELETE':
    //         if ($action == 'supprimerEnseignant') {
    //             // Supprimer un enseignant
    //             $id = $_GET['id'] ?? null;
    //             if ($id) {
    //                 $query = "DELETE FROM enseignants WHERE id = ?";
    //                 $stmt = $pdo->prepare($query);
    //                 $stmt->execute([$id]);
    //                 echo json_encode(['message' => "Enseignant supprimé avec succès"]);
    //             } else {
    //                 echo json_encode(['error' => 'ID non spécifié']);
    //             }
    //         }
    //         break;
    
    //     default:
    //         echo json_encode(['error' => 'Méthode non supportée']);
    //         break;
    // }


    switch ($method) {
        case 'GET':
            if ($action == 'getEnseignants') {
                $annee_scolaire_id = $_GET['annee_scolaire_id'] ?? null;
                if ($annee_scolaire_id) {
                    $query = "SELECT * FROM enseignants WHERE annee_scolaire_id = :annee_scolaire_id";
                    $stmt = $pdo->prepare($query);
                    $stmt->execute(['annee_scolaire_id' => $annee_scolaire_id]);
                    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
                } else {
                    echo json_encode(['error' => 'L\'année scolaire est requise']);
                }
            } elseif ($action == 'getEnseignantById') {
                $id = $_GET['id'] ?? null;
                if ($id) {
                    $query = "SELECT * FROM enseignants WHERE id = ?";
                    $stmt = $pdo->prepare($query);
                    $stmt->execute([$id]);
                    echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
                } else {
                    echo json_encode(['error' => 'ID non spécifié']);
                }
            }
            break;

        case 'POST':
            if ($action == 'ajouterEnseignant') {
                $data = json_decode(file_get_contents("php://input"), true) ?? $_POST;
                $prenom = $data['prenom'] ?? '';
                $nom = $data['nom'] ?? '';
                $date_naissance = $data['date_naissance'] ?? null;
                $lieu_naissance = $data['lieu_naissance'] ?? '';
                $telephone = $data['telephone'] ?? '';
                $profession = $data['profession'] ?? '';
                $annee_scolaire_id = $data['annee_scolaire_id'] ?? null;
                
                if (!$annee_scolaire_id) {
                    echo json_encode(['error' => 'L\'année scolaire est obligatoire']);
                    exit;
                }
                
                $query = "INSERT INTO enseignants (prenom, nom, date_naissance, lieu_naissance, telephone, profession, annee_scolaire_id) 
                        VALUES (:prenom, :nom, :date_naissance, :lieu_naissance, :telephone, :profession, :annee_scolaire_id)";
                $stmt = $pdo->prepare($query);
                $stmt->execute(compact("prenom", "nom", "date_naissance", "lieu_naissance", "telephone", "profession", "annee_scolaire_id"));
                
                echo json_encode(["message" => "Enseignant ajouté avec succès"]);
            }
            break;

        case 'PUT':
            if ($action == 'modifierEnseignant') {
                $data = json_decode(file_get_contents("php://input"), true);
                if (!$data || !isset($data['id'])) {
                    echo json_encode(["error" => "ID non spécifié"]);
                    exit;
                }
                
                $query = "UPDATE enseignants SET prenom = :prenom, nom = :nom, date_naissance = :date_naissance, 
                        lieu_naissance = :lieu_naissance, telephone = :telephone, profession = :profession, 
                        annee_scolaire_id = :annee_scolaire_id WHERE id = :id";
                $stmt = $pdo->prepare($query);
                $stmt->execute($data);
                
                echo json_encode(["message" => "Enseignant modifié avec succès"]);
            }
            break;

        case 'DELETE':
            if ($action == 'supprimerEnseignant') {
                $id = $_GET['id'] ?? null;
                if ($id) {
                    $query = "DELETE FROM enseignants WHERE id = ?";
                    $stmt = $pdo->prepare($query);
                    $stmt->execute([$id]);
                    echo json_encode(['message' => "Enseignant supprimé avec succès"]);
                } else {
                    echo json_encode(['error' => 'ID non spécifié']);
                }
            }
            break;

        default:
            echo json_encode(['error' => 'Méthode non supportée']);
            break;
    }


    // Pour les emplois du temps

    // switch ($method) {
    //     case 'GET':
    //         if ($action == 'getEmplois') {

    //         $id = isset($_GET['classe_id']) ? intval($_GET['classe_id']) : 0;
    //             if ($id > 0) {
    //                 $query = "SELECT 
    //                             heure,
    //                             MAX(CASE WHEN jour = 'Lundi' THEN matiere END) AS Lundi,
    //                             MAX(CASE WHEN jour = 'Mardi' THEN matiere END) AS Mardi,
    //                             MAX(CASE WHEN jour = 'Mercredi' THEN matiere END) AS Mercredi,
    //                             MAX(CASE WHEN jour = 'Jeudi' THEN matiere END) AS Jeudi,
    //                             MAX(CASE WHEN jour = 'Vendredi' THEN matiere END) AS Vendredi,
    //                             MAX(CASE WHEN jour = 'Samedi' THEN matiere END) AS Samedi
    //                         FROM (
    //                             SELECT
    //                                 e.heure,
    //                                 e.jour,
    //                                 m.nom AS matiere
    //                             FROM emplois_temps e
    //                             JOIN matieres m ON e.matiere_id = m.id
    //                             WHERE e.classe_id = :classe_id
    //                         ) AS subquery
    //                         GROUP BY heure
    //                         ORDER BY heure";
                    

    //                 $stmt = $pdo->prepare($query);
    //                 $stmt->bindParam(':classe_id', $id, PDO::PARAM_INT);
    //                 $stmt->execute();

    //                 // var_dump($stmt->fetchAll(PDO::FETCH_ASSOC)); exit;

    //                 $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    //                 echo json_encode($result);
    //             } else {
    //                 echo json_encode(["error" => "Classe non valide"]);
    //             }
    //         }
    //         break;
    
    //     case 'POST':
    //         $data = json_decode(file_get_contents("php://input"), true);
    //         // Vérifier si les données sont bien un tableau
    //         if (!is_array($data) || empty($data)) {
    //             echo json_encode(["error" => "Données incomplètes"]);
    //             exit;
    //         }
    
    //         if ($action == 'ajouterEmplois') {
    //             // $query = "INSERT INTO emplois_temps (jour, heure, matiere_id, classe_id) 
    //             //           VALUES (:jour, :heure, :matiere_id, :classe_id)";
    //             // $stmt = $pdo->prepare($query);
    //             // if ($stmt->execute($data)) {
    //             //     echo json_encode(["message" => "Emploi du temps ajouté avec succès"]);
    //             // } else {
    //             //     echo json_encode(["error" => "Erreur lors de l'ajout"]);
    //             // }

    //             $query = "INSERT INTO emplois_temps (classe_id, jour, heure, matiere_id) VALUES (?, ?, ?, ?)";
    //             $stmt = $pdo->prepare($query);
                
    //             $errors = [];
    //             foreach ($data as $emploi) {
    //                 if (!isset($emploi['classe_id'], $emploi['jour'], $emploi['heure'], $emploi['matiere_id'])) {
    //                     $errors[] = "Données incomplètes pour un emploi du temps.";
    //                     continue;
    //                 }

    //                 // Convertir l'heure au bon format (si nécessaire)
    //                 $heure = explode(' - ', $emploi['heure'])[0]; // Prend seulement l'heure de début

    //                 $success = $stmt->execute([$emploi['classe_id'], $emploi['jour'], $heure, $emploi['matiere_id']]);
    //                 if (!$success) {
    //                     $errors[] = "Erreur lors de l'insertion pour " . json_encode($emploi);
    //                 }
    //             }
    //             if (!empty($errors)) {
    //                 echo json_encode(["error" => $errors]);
    //             } else {
    //                 echo json_encode(["success" => true]);
    //             }
    //         }
    //         break;
    
    //     case 'PUT':
    //         if ($action == 'modifierEmplois' && isset($_GET['id'])) {
    //             /*$id = $_GET['id'];*/
    //             $id = intval($_GET['id']);
    //             $data = json_decode(file_get_contents("php://input"), true);

    //             if (isset($data['jour'], $data['heure'], $data['matiere_id'], $data['classe_id'])) {
    //                 $query = "UPDATE emplois_temps SET 
    //                             jour = :jour, 
    //                             heure = :heure, 
    //                             matiere_id = :matiere_id, 
    //                             classe_id = :classe_id 
    //                         WHERE id = :id";
    //                 $stmt = $pdo->prepare($query);
    //                 file_put_contents("debug_log.txt", "Requête exécutée : $query\nID : $id\n", FILE_APPEND);
    //                 $stmt->bindParam(':jour', $data['jour']);
    //                 $stmt->bindParam(':heure', $data['heure']);
    //                 $stmt->bindParam(':matiere_id', $data['matiere_id']);
    //                 // $stmt->bindParam(':enseignant_id', $data['enseignant_id']);
    //                 $stmt->bindParam(':classe_id', $data['classe_id']);
    //                 $stmt->bindParam(':id', $id);

    //                 /*file_put_contents("debug_log.txt", "Requête SQL exécutée : $query\n", FILE_APPEND);*/

    //                 if ($stmt->execute()) {
    //                     echo json_encode(["message" => "Emploi du temps modifié avec succès"]);
    //                 } else {
    //                     echo json_encode(["error" => "Erreur lors de la modification"]);
    //                 }
    //             } else {
    //                 echo json_encode(["error" => "Données incomplètes"]);
    //             }
    //         }
    //         break;
    
    //     case 'DELETE':
    //         if ($action == 'supprimerEmplois' && isset($_GET['id'])) {
    //             $query = "DELETE FROM emplois_temps WHERE id = :id";
    //             $stmt = $pdo->prepare($query);
    //             $stmt->bindParam(':id', $_GET['id']);
    //             if ($stmt->execute()) {
    //                 echo json_encode(["message" => "Emploi du temps supprimé avec succès"]);
    //             } else {
    //                 echo json_encode(["error" => "Erreur lors de la suppression"]);
    //             }
    //         }
    //         break;
    
    //     default:
    //         echo json_encode(["message" => "Méthode non autorisée"]);
    // }

    switch ($method) {
        case 'GET':
            if ($action === 'getEmplois') {
                $classe_id = $_GET['classe_id'] ?? null;
                $annee_scolaire_id = $_GET['annee_scolaire_id'] ?? null;
    
                if ($classe_id && $annee_scolaire_id) {
                    $query = "SELECT 
                                heure,
                                MAX(CASE WHEN jour = 'Lundi' THEN matiere END) AS Lundi,
                                MAX(CASE WHEN jour = 'Mardi' THEN matiere END) AS Mardi,
                                MAX(CASE WHEN jour = 'Mercredi' THEN matiere END) AS Mercredi,
                                MAX(CASE WHEN jour = 'Jeudi' THEN matiere END) AS Jeudi,
                                MAX(CASE WHEN jour = 'Vendredi' THEN matiere END) AS Vendredi,
                                MAX(CASE WHEN jour = 'Samedi' THEN matiere END) AS Samedi
                              FROM (
                                  SELECT
                                      e.heure,
                                      e.jour,
                                      m.nom AS matiere
                                  FROM emplois_temps e
                                  JOIN matieres m ON e.matiere_id = m.id
                                  WHERE e.classe_id = :classe_id AND e.annee_scolaire_id = :annee_scolaire_id
                              ) AS subquery
                              GROUP BY heure
                              ORDER BY heure";
    
                    $stmt = $pdo->prepare($query);
                    $stmt->execute([
                        'classe_id' => $classe_id,
                        'annee_scolaire_id' => $annee_scolaire_id
                    ]);
                    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
                } else {
                    echo json_encode(['error' => 'Classe ou année scolaire manquante']);
                }
            }
            elseif ($action === 'getAllEmplois') {
                $query = "SELECT * FROM emplois_temps";
                $stmt = $pdo->prepare($query);
                $stmt->execute();
                echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            }
            break;
    
        /*case 'POST':
            if ($action === 'ajouterEmplois') {
                $stmt = $pdo->prepare("INSERT INTO emplois_temps (classe_id, jour, heure, matiere_id, annee_scolaire_id) 
                                       VALUES (:classe_id, :jour, :heure, :matiere_id, :annee_scolaire_id)");
    
                $errors = [];
                foreach ($data as $emploi) {
                    if (!isset($emploi['classe_id'], $emploi['jour'], $emploi['heure'], $emploi['matiere_id'], $emploi['annee_scolaire_id'])) {
                        $errors[] = 'Données manquantes';
                        continue;
                    }
    
                    $heure = explode(' - ', $emploi['heure'])[0];
    
                    $stmt->execute([
                        'classe_id' => $emploi['classe_id'],
                        'jour' => $emploi['jour'],
                        'heure' => $heure,
                        'matiere_id' => $emploi['matiere_id'],
                        'annee_scolaire_id' => $emploi['annee_scolaire_id']
                    ]);
                }
    
                if (!empty($errors)) {
                    echo json_encode(['error' => $errors]);
                } else {
                    echo json_encode(['message' => 'Emplois ajoutés avec succès']);
                }
            }
            break;*/

            case 'POST':
                if ($action === 'ajouterEmplois') {
                    $emplois = json_decode(file_get_contents("php://input"), true);

                    if (!is_array($emplois)) {
                        echo json_encode(['success' => false, 'message' => 'Format de données invalide.']);
                        exit;
                    }

                    $stmt = $pdo->prepare("INSERT INTO emplois_temps (classe_id, jour, heure, matiere_id, annee_scolaire_id)
                                        VALUES (?, ?, ?, ?, ?)");

                    $errors = [];
                    foreach ($emplois as $emploi) {
                        if (
                            isset($emploi['classe_id'], $emploi['jour'], $emploi['heure'],
                                $emploi['matiere_id'], $emploi['annee_scolaire_id'])
                        ) {
                            $stmt->execute([
                                $emploi['classe_id'],
                                $emploi['jour'],
                                $emploi['heure'],
                                $emploi['matiere_id'],
                                $emploi['annee_scolaire_id']
                            ]);
                        } else {
                            $errors[] = $emploi;
                        }
                    }

                    if (!empty($errors)) {
                        echo json_encode(['success' => false, 'message' => 'Certains emplois sont incomplets.', 'erreurs' => $errors]);
                    } else {
                        echo json_encode(['success' => true, 'message' => 'Tous les emplois ont été ajoutés avec succès.']);
                    }
                }
                break;

    
        case 'PUT':
            if ($action === 'modifierEmploi') {
                if (!isset($data['id'])) {
                    echo json_encode(['error' => 'ID non spécifié']);
                    exit;
                }
    
                $heure = explode(' - ', $data['heure'])[0];
    
                $query = "UPDATE emplois_temps SET 
                            classe_id = :classe_id,
                            jour = :jour,
                            heure = :heure,
                            matiere_id = :matiere_id,
                            annee_scolaire_id = :annee_scolaire_id
                          WHERE id = :id";
    
                $stmt = $pdo->prepare($query);
                $stmt->execute([
                    'classe_id' => $data['classe_id'],
                    'jour' => $data['jour'],
                    'heure' => $heure,
                    'matiere_id' => $data['matiere_id'],
                    'annee_scolaire_id' => $data['annee_scolaire_id'],
                    'id' => $data['id']
                ]);
    
                echo json_encode(['message' => 'Emploi modifié avec succès']);
            }
            break;
    
        case 'DELETE':
            if ($action === 'supprimerEmploi') {
                $id = $_GET['id'] ?? null;
                if ($id) {
                    $query = "DELETE FROM emplois_temps WHERE id = ?";
                    $stmt = $pdo->prepare($query);
                    $stmt->execute([$id]);
                    echo json_encode(['message' => 'Emploi supprimé avec succès']);
                } else {
                    echo json_encode(['error' => 'ID non spécifié']);
                }
            }
            break;
    
        default:
            echo json_encode(['error' => 'Méthode non supportée']);
            break;
    }


    // Pour les absences


    // switch ($method) {
    //     case 'GET':
    //         if ($action == 'getAbsences') {
    //             $query = "SELECT 
    //                         a.id, 
    //                         e.prenom AS eleve_prenom, e.nom AS eleve_nom, 
    //                         m.nom AS matiere_nom, 
    //                         c.nom_classe AS classe_nom, 
    //                         a.jour, 
    //                         a.heure_debut, 
    //                         a.heure_fin, 
    //                         a.date_absence, 
    //                         CONCAT(ens.prenom, ' ', ens.nom) AS enseignant_nom,
    //                         a.justifie, 
    //                         a.motif_justifie
    //                     FROM absences a
    //                     LEFT JOIN eleves e ON a.eleve_id = e.id
    //                     LEFT JOIN matieres m ON a.matiere_id = m.id
    //                     LEFT JOIN classes c ON a.classe_id = c.id
    //                     LEFT JOIN enseignants ens ON a.enseignant_id = ens.id";
    //             $stmt = $pdo->prepare($query);
    //             $stmt->execute();
    //             echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    //         }

    //         elseif ($action == 'getAbsenceById' && isset($_GET['id'])) {
    //             $id = $_GET['id'];
    //             $query = "SELECT 
    //                          a.id, 
    //                         a.eleve_id,   -- 🔹 Ajout de eleve_id
    //                         a.matiere_id, -- 🔹 Ajout de matiere_id
    //                         a.classe_id,  -- 🔹 Ajout de classe_id
    //                         a.enseignant_id, -- 🔹 Ajout de enseignant_id
    //                         e.prenom AS eleve_prenom, e.nom AS eleve_nom, 
    //                         m.nom AS matiere_nom, 
    //                         c.nom_classe AS classe_nom, 
    //                         a.jour, 
    //                         a.heure_debut, 
    //                         a.heure_fin, 
    //                         a.date_absence, 
    //                         CONCAT(ens.prenom, ' ', ens.nom) AS enseignant_nom,
    //                         a.justifie, 
    //                         a.motif_justifie
    //                     FROM absences a
    //                     LEFT JOIN eleves e ON a.eleve_id = e.id
    //                     LEFT JOIN matieres m ON a.matiere_id = m.id
    //                     LEFT JOIN classes c ON a.classe_id = c.id
    //                     LEFT JOIN enseignants ens ON a.enseignant_id = ens.id
    //                     WHERE a.id = :id";
    //             $stmt = $pdo->prepare($query);
    //             $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    //             $stmt->execute();
                
    //             $result = $stmt->fetch(PDO::FETCH_ASSOC);
    //             if ($result) {
    //                 echo json_encode($result);
    //             } else {
    //                 echo json_encode(["error" => "Aucune absence trouvée pour l'ID : $id"]);
    //             }
    //         }


    //         break;

    //         case 'POST':
    //             if ($action == 'ajouterAbsence') {
    //                 $data = json_decode(file_get_contents("php://input"), true);
                    
    //                 $query = "INSERT INTO absences (eleve_id, matiere_id, classe_id, jour, heure_debut, heure_fin, date_absence, enseignant_id, justifie, motif_justifie) 
    //                           VALUES (:eleve_id, :matiere_id, :classe_id, :jour, :heure_debut, :heure_fin, :date_absence, :enseignant_id, :justifie, :motif_justifie)";
                    
    //                 $stmt = $pdo->prepare($query);
    //                 $stmt->bindParam(':eleve_id', $data['eleve_id']);
    //                 $stmt->bindParam(':matiere_id', $data['matiere_id']);
    //                 $stmt->bindParam(':classe_id', $data['classe_id']);
    //                 $stmt->bindParam(':jour', $data['jour']);
    //                 $stmt->bindParam(':heure_debut', $data['heure_debut']);
    //                 $stmt->bindParam(':heure_fin', $data['heure_fin']);
    //                 $stmt->bindParam(':date_absence', $data['date_absence']);
    //                 $stmt->bindParam(':enseignant_id', $data['enseignant_id']);
    //                 $stmt->bindParam(':justifie', $data['justifie']);
    //                 $stmt->bindParam(':motif_justifie', $data['motif_justifie']);
            
    //                 if ($stmt->execute()) {
    //                     echo json_encode(["message" => "Absence ajoutée avec succès"]);
    //                 } else {
    //                     echo json_encode(["error" => "Erreur lors de l'ajout"]);
    //                 }
    //             }
    //             break;

    //     case 'PUT':
    //         if ($action == 'modifierAbsence' && isset($_GET['id'])) {
    //             $id = intval($_GET['id']);
    //             $data = json_decode(file_get_contents("php://input"), true);

    //             if (isset($data['eleve_id'], $data['matiere_id'], $data['classe_id'], $data['jour'], $data['heure_debut'], $data['heure_fin'], $data['date_absence'], $data['enseignant_id'], $data['justifie'], $data['motif_justifie'])) {
    //                 $query = "UPDATE absences SET 
    //                             eleve_id = :eleve_id, 
    //                             matiere_id = :matiere_id, 
    //                             classe_id = :classe_id, 
    //                             jour = :jour, 
    //                             heure_debut = :heure_debut, 
    //                             heure_fin = :heure_fin, 
    //                             date_absence = :date_absence, 
    //                             enseignant_id = :enseignant_id, 
    //                             justifie = :justifie, 
    //                             motif_justifie = :motif_justifie 
    //                         WHERE id = :id";
    //                 file_put_contents("debug.log", print_r($data, true)); 
    //                 $stmt = $pdo->prepare($query);
    //                 $stmt->bindParam(':eleve_id', $data['eleve_id']);
    //                 $stmt->bindParam(':matiere_id', $data['matiere_id']);
    //                 $stmt->bindParam(':classe_id', $data['classe_id']);
    //                 $stmt->bindParam(':jour', $data['jour']);
    //                 $stmt->bindParam(':heure_debut', $data['heure_debut']);
    //                 $stmt->bindParam(':heure_fin', $data['heure_fin']);
    //                 $stmt->bindParam(':date_absence', $data['date_absence']);
    //                 $stmt->bindParam(':enseignant_id', $data['enseignant_id']);
    //                 $stmt->bindParam(':justifie', $data['justifie']);
    //                 $stmt->bindParam(':motif_justifie', $data['motif_justifie']);
    //                 $stmt->bindParam(':id', $id);

    //                 if ($stmt->execute()) {
    //                     echo json_encode(["message" => "Absence modifiée avec succès"]);
    //                     exit; // ⚠️ Ajout d'un exit pour éviter d'envoyer une réponse vide
    //                 } else {
    //                     echo json_encode(["error" => "Erreur lors de la modification"]);
    //                 }
    //             } else {
    //                 echo json_encode(["error" => "Données incomplètes"]);
    //             }
    //         }
    //         break;

    //     case 'DELETE':
    //         if ($action == 'supprimerAbsence' && isset($_GET['id'])) {
    //             $query = "DELETE FROM absences WHERE id = :id";
    //             $stmt = $pdo->prepare($query);
    //             $stmt->bindParam(':id', $_GET['id']);
    //             if ($stmt->execute()) {
    //                 echo json_encode(["message" => "Absence supprimée avec succès"]);
    //             } else {
    //                 echo json_encode(["error" => "Erreur lors de la suppression"]);
    //             }
    //         }
    //         break;

    //     default:
    //         echo json_encode(["message" => "Méthode non autorisée"]);
    // }

    switch ($method) {
        case 'GET':
            if ($action === 'getAbsences') {
                $anneeScolaireId = $_GET['annee_scolaire_id'];
                $query = "SELECT a.*, 
                                 e.prenom AS eleve_prenom, e.nom AS eleve_nom, 
                                 m.nom As matiere_nom, 
                                 c.nom_classe , 
                                 ens.prenom AS enseignant_prenom, ens.nom AS enseignant_nom
                          FROM absences a
                          JOIN eleves e ON a.eleve_id = e.id
                          JOIN matieres m ON a.matiere_id = m.id
                          JOIN classes c ON a.classe_id = c.id
                          JOIN enseignants ens ON a.enseignant_id = ens.id
                          WHERE a.annee_scolaire_id = ?";
                $stmt = $pdo->prepare($query);
                $stmt->execute([$anneeScolaireId]);
                $absences = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($absences);
            } elseif ($action === 'getAbsenceById') {
                $id = $_GET['id'];
                $query = "SELECT a.*, 
                                 e.prenom AS eleve_prenom, e.nom AS eleve_nom, 
                                 m.nom As matiere_nom, 
                                 c.nom_classe, 
                                 ens.prenom AS enseignant_prenom, ens.nom AS enseignant_nom
                          FROM absences a
                          JOIN eleves e ON a.eleve_id = e.id
                          JOIN matieres m ON a.matiere_id = m.id
                          JOIN classes c ON a.classe_id = c.id
                          JOIN enseignants ens ON a.enseignant_id = ens.id
                          WHERE a.id = ?";
                $stmt = $pdo->prepare($query);
                $stmt->execute([$id]);
                $absence = $stmt->fetch(PDO::FETCH_ASSOC);
                echo json_encode($absence);
            } elseif ($action === 'getAbsencesByEleveId') {
                $eleveId = $_GET['eleve_id'];
                $anneeScolaireId = $_GET['annee_scolaire_id'];
                $query = "SELECT a.*, 
                                 e.prenom AS eleve_prenom, e.nom AS eleve_nom, 
                                 m.nom AS matiere_nom, 
                                 c.nom_classe, 
                                 ens.prenom AS enseignant_prenom, ens.nom AS enseignant_nom
                          FROM absences a
                          JOIN eleves e ON a.eleve_id = e.id
                          JOIN matieres m ON a.matiere_id = m.id
                          JOIN classes c ON a.classe_id = c.id
                          JOIN enseignants ens ON a.enseignant_id = ens.id
                          WHERE a.eleve_id = ? AND a.annee_scolaire_id = ?";
                $stmt = $pdo->prepare($query);
                $stmt->execute([$eleveId, $anneeScolaireId]);
                $absences = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($absences);
            }
            break;
    
        case 'POST':
            if ($action === 'ajouterAbsence') {
                $data = json_decode(file_get_contents("php://input"), true);
                $query = "INSERT INTO absences (eleve_id, matiere_id, classe_id, jour, heure_debut, heure_fin, date_absence, enseignant_id, justifie, motif_justifie, annee_scolaire_id) 
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                $stmt = $pdo->prepare($query);
                $stmt->execute([
                    $data['eleve_id'], $data['matiere_id'], $data['classe_id'], $data['jour'], $data['heure_debut'], 
                    $data['heure_fin'], $data['date_absence'], $data['enseignant_id'], $data['justifie'], 
                    $data['motif_justifie'], $data['annee_scolaire_id']
                ]);
                echo json_encode(["message" => "Absence ajoutée avec succès"]);
            }
            break;
    
        case 'PUT':
            if ($action === 'modifierAbsence') {
                $id = $_GET['id'];
                $data = json_decode(file_get_contents("php://input"), true);
                $query = "UPDATE absences 
                          SET eleve_id = ?, matiere_id = ?, classe_id = ?, jour = ?, heure_debut = ?, 
                              heure_fin = ?, date_absence = ?, enseignant_id = ?, justifie = ?, 
                              motif_justifie = ?, annee_scolaire_id = ?
                          WHERE id = ?";
                $stmt = $pdo->prepare($query);
                $stmt->execute([
                    $data['eleve_id'], $data['matiere_id'], $data['classe_id'], $data['jour'], $data['heure_debut'], 
                    $data['heure_fin'], $data['date_absence'], $data['enseignant_id'], $data['justifie'], 
                    $data['motif_justifie'], $data['annee_scolaire_id'], $id
                ]);
                echo json_encode(["message" => "Absence modifiée avec succès"]);
            }
            break;
    
        case 'DELETE':
            if ($action === 'supprimerAbsence') {
                $id = $_GET['id'];
                $query = "DELETE FROM absences WHERE id = ?";
                $stmt = $pdo->prepare($query);
                $stmt->execute([$id]);
                echo json_encode(["message" => "Absence supprimée avec succès"]);
            }
            break;
    
        default:
            echo json_encode(["error" => "Méthode non supportée"]);
            break;
    }
    


    // API pour les notes

    // switch ($method) {
    //     case 'GET':
    //         if ($action == 'getNotes') {
    //             $query = "SELECT 
    //                         n.id, 
    //                         e.prenom AS eleve_prenom, e.nom AS eleve_nom, 
    //                         m.nom AS matiere_nom, 
    //                         c.nom_classe AS classe_nom, 
    //                         n.semestre, n.devoir1, n.devoir2, n.composition, 
    //                         n.coefficient, 
    //                         CONCAT(ens.prenom, ' ', ens.nom) AS enseignant_nom
    //                     FROM notes n
    //                     LEFT JOIN eleves e ON n.eleve_id = e.id
    //                     LEFT JOIN matieres m ON n.matiere_id = m.id
    //                     LEFT JOIN classes c ON n.classe_id = c.id
    //                     LEFT JOIN enseignants ens ON n.enseignant_id = ens.id";
    //             $stmt = $pdo->prepare($query);
    //             $stmt->execute();
    //             $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    //             header('Content-Type: application/json');
    //             echo json_encode($result ?: []);

    //             // Log for debugging
    //             if (!$result) {
    //                 error_log("Aucune donnée trouvée.");
    //             }
    //         }
    //         elseif ($action == 'getNoteById' && isset($_GET['id'])) {
    //             $id = $_GET['id'];
    //             $query = "SELECT 
    //                         n.id, 
    //                         n.eleve_id, 
    //                         n.matiere_id, 
    //                         n.classe_id, 
    //                         n.enseignant_id, 
    //                         e.prenom AS eleve_prenom, e.nom AS eleve_nom, 
    //                         m.nom AS matiere_nom, 
    //                         c.nom_classe AS classe_nom, 
    //                         n.semestre, n.devoir1, n.devoir2, n.composition, 
    //                         n.coefficient, 
    //                         CONCAT(ens.prenom, ' ', ens.nom) AS enseignant_nom
    //                     FROM notes n
    //                     LEFT JOIN eleves e ON n.eleve_id = e.id
    //                     LEFT JOIN matieres m ON n.matiere_id = m.id
    //                     LEFT JOIN classes c ON n.classe_id = c.id
    //                     LEFT JOIN enseignants ens ON n.enseignant_id = ens.id
    //                     WHERE n.id = :id";
    //             $stmt = $pdo->prepare($query);
    //             $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    //             $stmt->execute();
                
    //             $result = $stmt->fetch(PDO::FETCH_ASSOC);
    //             echo json_encode($result ?: ["error" => "Aucune note trouvée pour l'ID : $id"]);
    //         }
    //         break;
        
    //     case 'POST':
    //         if ($action == 'ajouterNote') {
    //             $data = json_decode(file_get_contents("php://input"), true);
    //             $query = "INSERT INTO notes (eleve_id, matiere_id, classe_id, enseignant_id, semestre, devoir1, devoir2, 
    //                                 composition, coefficient) 
    //                     VALUES (:eleve_id, :matiere_id, :classe_id, :enseignant_id, :semestre, :devoir1, :devoir2, :composition,   :coefficient)";
    //             $stmt = $pdo->prepare($query);
    //             $stmt->execute($data);
    //             echo json_encode(["message" => "Note ajoutée avec succès"]);
    //         }
    //         break;
        
    //     case 'PUT':
    //         if ($action == 'modifierNote' && isset($_GET['id'])) {
    //             $id = intval($_GET['id']);
    //             $data = json_decode(file_get_contents("php://input"), true);
    //             $query = "UPDATE notes SET 
    //                         eleve_id = :eleve_id, 
    //                         matiere_id = :matiere_id, 
    //                         classe_id = :classe_id, 
    //                         enseignant_id = :enseignant_id, 
    //                         semestre = :semestre,
    //                         devoir1 = :devoir1, 
    //                         devoir2 = :devoir2, 
    //                         composition = :composition, 
    //                         coefficient = :coefficient
    //                     WHERE id = :id";
    //             $stmt = $pdo->prepare($query);
    //             $data['id'] = $id;
    //             $stmt->execute($data);
    //             echo json_encode(["message" => "Note modifiée avec succès"]);
    //         }
    //         break;
        
    //     case 'DELETE':
    //         if ($action == 'supprimerNote' && isset($_GET['id'])) {
    //             $query = "DELETE FROM notes WHERE id = :id";
    //             $stmt = $pdo->prepare($query);
    //             $stmt->bindParam(':id', $_GET['id']);
    //             $stmt->execute();
    //             echo json_encode(["message" => "Note supprimée avec succès"]);
    //         }
    //         break;
        
    //     default:
    //         echo json_encode(["message" => "Méthode non autorisée"]);
    // }


    switch ($method) {
        case 'GET':
            if ($action === 'getNotes') {
                $anneeScolaireId = $_GET['annee_scolaire_id'];
                $query = "SELECT n.*, 
                                 e.prenom AS eleve_prenom, e.nom AS eleve_nom, 
                                 m.nom AS matiere_nom, 
                                 c.nom_classe, 
                                 ens.prenom AS enseignant_prenom, ens.nom AS enseignant_nom
                          FROM notes n
                          JOIN eleves e ON n.eleve_id = e.id
                          JOIN matieres m ON n.matiere_id = m.id
                          JOIN classes c ON n.classe_id = c.id
                          JOIN enseignants ens ON n.enseignant_id = ens.id
                          WHERE n.annee_scolaire_id = ?";
                $stmt = $pdo->prepare($query);
                $stmt->execute([$anneeScolaireId]);
                $notes = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($notes);
            } elseif ($action === 'getNoteById') {
                $id = $_GET['id'];
                $query = "SELECT n.*, 
                                 e.prenom AS eleve_prenom, e.nom AS eleve_nom, 
                                 m.nom AS matiere_nom, 
                                 c.nom_classe, 
                                 ens.prenom AS enseignant_prenom, ens.nom AS enseignant_nom
                          FROM notes n
                          JOIN eleves e ON n.eleve_id = e.id
                          JOIN matieres m ON n.matiere_id = m.id
                          JOIN classes c ON n.classe_id = c.id
                          JOIN enseignants ens ON n.enseignant_id = ens.id
                          WHERE n.id = ?";
                $stmt = $pdo->prepare($query);
                $stmt->execute([$id]);
                $note = $stmt->fetch(PDO::FETCH_ASSOC);
                echo json_encode($note);
            } elseif ($action === 'getNotesByEleveId') {
                if (!isset($_GET['eleve_id'])) {
                    echo json_encode(["error" => "ID de l'élève manquant"]);
                    exit;
                }
            
                $eleveId = $_GET['eleve_id'];
                $query = "SELECT n.*, 
                                 e.prenom AS eleve_prenom, e.nom AS eleve_nom, 
                                 m.nom AS matiere_nom, 
                                 c.nom_classe, 
                                 ens.prenom AS enseignant_prenom, ens.nom AS enseignant_nom
                          FROM notes n
                          JOIN eleves e ON n.eleve_id = e.id
                          JOIN matieres m ON n.matiere_id = m.id
                          JOIN classes c ON n.classe_id = c.id
                          JOIN enseignants ens ON n.enseignant_id = ens.id
                          WHERE n.eleve_id = ?";
                          
                $stmt = $pdo->prepare($query);
                $stmt->execute([$eleveId]);
                $notes = $stmt->fetchAll(PDO::FETCH_ASSOC);
                
                echo json_encode($notes);
            }
            
            break;
    
        case 'POST':
            if ($action === 'ajouterNote') {
                $data = json_decode(file_get_contents("php://input"), true);
                $query = "INSERT INTO notes (eleve_id, matiere_id, classe_id, enseignant_id, semestre, devoir1, devoir2, composition, coefficient, annee_scolaire_id) 
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                $stmt = $pdo->prepare($query);
                $stmt->execute([
                    $data['eleve_id'], $data['matiere_id'], $data['classe_id'], $data['enseignant_id'], 
                    $data['semestre'], $data['devoir1'], $data['devoir2'], $data['composition'], 
                    $data['coefficient'], $data['annee_scolaire_id']
                ]);
                echo json_encode(["message" => "Note ajoutée avec succès"]);
            }
            break;
    
        case 'PUT':
            if ($action === 'modifierNote') {
                $id = $_GET['id'];
                $data = json_decode(file_get_contents("php://input"), true);
                $query = "UPDATE notes 
                          SET eleve_id = ?, matiere_id = ?, classe_id = ?, enseignant_id = ?, semestre = ?, 
                              devoir1 = ?, devoir2 = ?, composition = ?, coefficient = ?, annee_scolaire_id = ?
                          WHERE id = ?";
                $stmt = $pdo->prepare($query);
                $stmt->execute([
                    $data['eleve_id'], $data['matiere_id'], $data['classe_id'], $data['enseignant_id'], 
                    $data['semestre'], $data['devoir1'], $data['devoir2'], $data['composition'], 
                    $data['coefficient'], $data['annee_scolaire_id'], $id
                ]);
                echo json_encode(["message" => "Note modifiée avec succès"]);
            }
            break;
    
        case 'DELETE':
            if ($action === 'supprimerNote') {
                $id = $_GET['id'];
                $query = "DELETE FROM notes WHERE id = ?";
                $stmt = $pdo->prepare($query);
                $stmt->execute([$id]);
                echo json_encode(["message" => "Note supprimée avec succès"]);
            }
            break;
    
        default:
            echo json_encode(["error" => "Méthode non supportée"]);
            break;
    }
    


    //Api pour les scolarités

    // switch ($method) {
    //     case 'GET':
    //         if ($action == 'getScolarites') {
    //             $query = "SELECT 
    //                         s.id, 
    //                         CONCAT(e.prenom, ' ', e.nom) AS eleve_nom, 
    //                         e.date_naissance, e.sexe, 
    //                         c.nom_classe AS classe_nom, 
    //                         s.cout_scolarite, s.montant_paye, 
    //                         s.reste_a_payer, s.etat_scolarite, s.date_paiement
    //                     FROM scolarites s
    //                     LEFT JOIN eleves e ON s.eleve_id = e.id
    //                     LEFT JOIN classes c ON e.classe_id = c.id";
                        
    //             $stmt = $pdo->prepare($query);
    //             $stmt->execute();
    //             echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC) ?: []);
    //         } elseif ($action == 'getScolariteById' && isset($_GET['id'])) {
    //             $id = intval($_GET['id']);
    //             $query = "SELECT * FROM scolarites WHERE id = :id LIMIT 0, 25";
    //             $stmt = $pdo->prepare($query);
    //             $stmt->execute(['id' => $id]);
    //             $result = $stmt->fetch(PDO::FETCH_ASSOC);
    //             echo json_encode($result ?: null);  // Retourne null si aucune scolarité trouvée
    //         }
    //         break;

    //     case 'POST':
    //         if ($action == 'ajouterScolarite') {
    //             $data = json_decode(file_get_contents("php://input"), true);

    //             // Calcul automatique
    //             $reste_a_payer = $data['cout_scolarite'] - $data['montant_paye'];
    //             if ($reste_a_payer == 0) {
    //                 $etat_scolarite = 'payé';
    //             } elseif ($data['montant_paye'] > 0) {
    //                 $etat_scolarite = 'partiellement payé';
    //             } else {
    //                 $etat_scolarite = 'non payé';
    //             }
    //             $date_paiement = ($data['montant_paye'] > 0) ? date('Y-m-d') : null;
                

    //             $query = "INSERT INTO scolarites (eleve_id, cout_scolarite, montant_paye, reste_a_payer, etat_scolarite, date_paiement)
    //                     VALUES (:eleve_id, :cout_scolarite, :montant_paye, :reste_a_payer, :etat_scolarite, :date_paiement)";
    //             $stmt = $pdo->prepare($query);
    //             $stmt->execute([
    //                 'eleve_id' => $data['eleve_id'],
    //                 'cout_scolarite' => $data['cout_scolarite'],
    //                 'montant_paye' => $data['montant_paye'],
    //                 'reste_a_payer' => $reste_a_payer,
    //                 'etat_scolarite' => $etat_scolarite,
    //                 'date_paiement' => $date_paiement
    //             ]);

    //             echo json_encode(["message" => "Scolarité ajoutée avec succès"]);
    //         }
    //         break;

    //     case 'PUT':
    //         if ($action == 'modifierScolarite' && isset($_GET['id'])) {
    //             $id = intval($_GET['id']);
    //             $data = json_decode(file_get_contents("php://input"), true);

    //             // Recalcul des valeurs
    //             $reste_a_payer = $data['cout_scolarite'] - $data['montant_paye'];
    //             if ($reste_a_payer == 0) {
    //                 $etat_scolarite = 'payé';
    //             } elseif ($data['montant_paye'] > 0) {
    //                 $etat_scolarite = 'partiellement payé';
    //             } else {
    //                 $etat_scolarite = 'non payé';
    //             }
    //             $date_paiement = ($data['montant_paye'] > 0) ? date('Y-m-d') : null;

    //             $query = "UPDATE scolarites SET 
    //                         eleve_id = :eleve_id, 
    //                         cout_scolarite = :cout_scolarite, 
    //                         montant_paye = :montant_paye, 
    //                         reste_a_payer = :reste_a_payer, 
    //                         etat_scolarite = :etat_scolarite, 
    //                         date_paiement = :date_paiement
    //                     WHERE id = :id";
    //             $stmt = $pdo->prepare($query);
    //             $stmt->execute([
    //                 'eleve_id' => $data['eleve_id'],
    //                 'cout_scolarite' => $data['cout_scolarite'],
    //                 'montant_paye' => $data['montant_paye'],
    //                 'reste_a_payer' => $reste_a_payer,
    //                 'etat_scolarite' => $etat_scolarite,
    //                 'date_paiement' => $date_paiement,
    //                 'id' => $id
    //             ]);

    //             echo json_encode(["message" => "Scolarité modifiée avec succès"]);
    //         }
    //         break;

    //     case 'DELETE':
    //         if ($action == 'supprimerScolarite' && isset($_GET['id'])) {
    //             $query = "DELETE FROM scolarites WHERE id = :id";
    //             $stmt = $pdo->prepare($query);
    //             $stmt->bindParam(':id', $_GET['id']);
    //             $stmt->execute();
    //             echo json_encode(["message" => "Scolarité supprimée avec succès"]);
    //         }
    //         break;

    //     default:
    //         echo json_encode(["message" => "Méthode non autorisée"]);
    // }


    switch ($method) {
        case 'GET':
            if ($action === 'getScolarites') {
                $anneeScolaireId = $_GET['annee_scolaire_id'];
                $query = "SELECT 
                            s.id, 
                            CONCAT(e.prenom, ' ', e.nom) AS eleve_nom, 
                            e.date_naissance, e.sexe, 
                            c.nom_classe AS classe_nom, 
                            s.cout_scolarite, s.montant_paye, 
                            s.reste_a_payer, s.etat_scolarite, s.date_paiement
                          FROM scolarites s
                          JOIN eleves e ON s.eleve_id = e.id
                          JOIN classes c ON e.classe_id = c.id
                          WHERE s.annee_scolaire_id = ?";
                $stmt = $pdo->prepare($query);
                $stmt->execute([$anneeScolaireId]);
                $scolarites = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($scolarites);
            } elseif ($action === 'getScolariteById') {
                $id = $_GET['id'];
                $query = "SELECT s.*, 
                                 CONCAT(e.prenom, ' ', e.nom) AS eleve_nom, 
                                 e.date_naissance, e.sexe, 
                                 c.nom_classe AS classe_nom
                          FROM scolarites s
                          JOIN eleves e ON s.eleve_id = e.id
                          JOIN classes c ON e.classe_id = c.id
                          WHERE s.id = ?";
                $stmt = $pdo->prepare($query);
                $stmt->execute([$id]);
                $scolarite = $stmt->fetch(PDO::FETCH_ASSOC);
                echo json_encode($scolarite);
            }
            break;
    
        case 'POST':
            if ($action === 'ajouterScolarite') {
                $data = json_decode(file_get_contents("php://input"), true);
    
                $reste_a_payer = $data['cout_scolarite'] - $data['montant_paye'];
                $etat_scolarite = ($reste_a_payer == 0) ? 'payé' : (($data['montant_paye'] > 0) ? 'partiellement payé' : 'non payé');
                $date_paiement = ($data['montant_paye'] > 0) ? date('Y-m-d') : null;
    
                $query = "INSERT INTO scolarites (eleve_id, cout_scolarite, montant_paye, reste_a_payer, etat_scolarite, date_paiement, annee_scolaire_id)
                          VALUES (:eleve_id, :cout_scolarite, :montant_paye, :reste_a_payer, :etat_scolarite, :date_paiement, :annee_scolaire_id)";
                $stmt = $pdo->prepare($query);
                $stmt->execute([
                    'eleve_id' => $data['eleve_id'],
                    'cout_scolarite' => $data['cout_scolarite'],
                    'montant_paye' => $data['montant_paye'],
                    'reste_a_payer' => $reste_a_payer,
                    'etat_scolarite' => $etat_scolarite,
                    'date_paiement' => $date_paiement,
                    'annee_scolaire_id' => $data['annee_scolaire_id']
                ]);
    
                echo json_encode(["message" => "Scolarité ajoutée avec succès"]);
            }
            break;
    
        case 'PUT':
            if ($action === 'modifierScolarite') {
                $id = $_GET['id'];
                $data = json_decode(file_get_contents("php://input"), true);
    
                $reste_a_payer = $data['cout_scolarite'] - $data['montant_paye'];
                $etat_scolarite = ($reste_a_payer == 0) ? 'payé' : (($data['montant_paye'] > 0) ? 'partiellement payé' : 'non payé');
                $date_paiement = ($data['montant_paye'] > 0) ? date('Y-m-d') : null;
    
                $query = "UPDATE scolarites SET 
                            eleve_id = :eleve_id, 
                            cout_scolarite = :cout_scolarite, 
                            montant_paye = :montant_paye, 
                            reste_a_payer = :reste_a_payer, 
                            etat_scolarite = :etat_scolarite, 
                            date_paiement = :date_paiement, 
                            annee_scolaire_id = :annee_scolaire_id
                          WHERE id = :id";
                $stmt = $pdo->prepare($query);
                $stmt->execute([
                    'eleve_id' => $data['eleve_id'],
                    'cout_scolarite' => $data['cout_scolarite'],
                    'montant_paye' => $data['montant_paye'],
                    'reste_a_payer' => $reste_a_payer,
                    'etat_scolarite' => $etat_scolarite,
                    'date_paiement' => $date_paiement,
                    'annee_scolaire_id' => $data['annee_scolaire_id'],
                    'id' => $id
                ]);
    
                echo json_encode(["message" => "Scolarité modifiée avec succès"]);
            }
            break;
    
        case 'DELETE':
            if ($action === 'supprimerScolarite') {
                $id = $_GET['id'];
                $query = "DELETE FROM scolarites WHERE id = ?";
                $stmt = $pdo->prepare($query);
                $stmt->execute([$id]);
                echo json_encode(["message" => "Scolarité supprimée avec succès"]);
            }
            break;
    
        default:
            echo json_encode(["message" => "Méthode non supportée"]);
            break;
    }
    


    // Pour les emargements


    switch ($method) {
        case 'GET':
            if ($action === 'getEmargements') {
                // Fetch all emargements for the selected school year
                $anneeScolaireId = $_GET['annee_scolaire_id'] ?? null;
                if ($anneeScolaireId) {
                    $query = "SELECT e.*, 
                                    m.nom AS matiere_nom, 
                                    c.nom_classe, 
                                    ens.prenom AS enseignant_prenom, ens.nom AS enseignant_nom
                            FROM emargements e
                            JOIN matieres m ON e.matiere_id = m.id
                            JOIN classes c ON e.classe_id = c.id
                            JOIN enseignants ens ON e.enseignant_id = ens.id
                            WHERE e.annee_scolaire_id = ?";
                    $stmt = $pdo->prepare($query);
                    $stmt->execute([$anneeScolaireId]);
                    $emargements = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    echo json_encode($emargements);
                } else {
                    echo json_encode(['error' => 'annee_scolaire_id is required']);
                }
            } elseif ($action === 'getEmargementById') {
                // Fetch a single emargement by its ID
                $id = $_GET['id'] ?? null;
                if ($id) {
                    $query = "SELECT e.*, 
                                    m.nom AS matiere_nom, 
                                    c.nom_classe, 
                                    ens.prenom AS enseignant_prenom, ens.nom AS enseignant_nom
                                    
                            FROM emargements e
                            JOIN matieres m ON e.matiere_id = m.id
                            JOIN classes c ON e.classe_id = c.id
                            JOIN enseignants ens ON e.enseignant_id = ens.id
                             
                            WHERE e.id = ?";
                    $stmt = $pdo->prepare($query);
                    $stmt->execute([$id]);
                    $emargement = $stmt->fetch(PDO::FETCH_ASSOC);
                    echo json_encode($emargement);
                } else {
                    echo json_encode(['error' => 'ID is required']);
                }
            }
            break;

        case 'POST':
            if ($action === 'ajouterEmargement') {
                // Add a new emargement
                $data = json_decode(file_get_contents("php://input"), true);
                $query = "INSERT INTO emargements (enseignant_id, matiere_id, classe_id, titre_cours, date_heure, semestre, annee_scolaire_id) 
                        VALUES (?, ?, ?, ?, ?, ?, ?)";
                $stmt = $pdo->prepare($query);
                $stmt->execute([
                    $data['enseignant_id'], $data['matiere_id'], $data['classe_id'], 
                    $data['titre_cours'], $data['date_heure'], $data['semestre'], 
                    $data['annee_scolaire_id']
                ]);
                echo json_encode(["message" => "Émargement ajouté avec succès"]);
            }
            break;

        case 'PUT':
            if ($action === 'modifierEmargement') {
                // Update an existing emargement
                $id = $_GET['id'] ?? null;
                $data = json_decode(file_get_contents("php://input"), true);
                if ($id) {
                    $query = "UPDATE emargements 
                            SET enseignant_id = ?, matiere_id = ?, classe_id = ?, titre_cours = ?, date_heure = ?, semestre = ?, annee_scolaire_id = ?
                            WHERE id = ?";
                    $stmt = $pdo->prepare($query);
                    $stmt->execute([
                        $data['enseignant_id'], $data['matiere_id'], $data['classe_id'], 
                        $data['titre_cours'], $data['date_heure'], $data['semestre'], 
                        $data['annee_scolaire_id'], $id
                    ]);
                    file_put_contents("php://stderr", json_encode($data) . PHP_EOL);

                    echo json_encode(["message" => "Émargement modifié avec succès"]);
                } else {
                    echo json_encode(['error' => 'ID is required']);
                }
            }
            break;

        case 'DELETE':
            if ($action === 'supprimerEmargement') {
                // Delete an emargement by its ID
                $id = $_GET['id'] ?? null;
                if ($id) {
                    $query = "DELETE FROM emargements WHERE id = ?";
                    $stmt = $pdo->prepare($query);
                    $stmt->execute([$id]);
                    echo json_encode(["message" => "Émargement supprimé avec succès"]);
                } else {
                    echo json_encode(['error' => 'ID is required']);
                }
            }
            break;

        default:
            echo json_encode(["error" => "Méthode non supportée"]);
            break;
    }



    //Pour les ___ recherches ____
    
    // if ($_GET['action'] == 'recherche' && isset($_GET['q'])) {
    //     $query = $_GET['q'];
    
    //     $stmt = $pdo->prepare("
    //         SELECT id, nom, prenom, date_naissance, classe_id, groupe, nationalite, adresse, telephone, sexe, 'eleve' AS type 
    //         FROM eleves 
    //         WHERE nom LIKE ? OR prenom LIKE ?
    //         UNION
    //         SELECT id, nom_classe AS nom, '' AS prenom, '' AS date_naissance, '' AS classe_id, '' AS groupe, '' AS nationalite, '' AS adresse, '' AS telephone, '' AS sexe, 'classe' AS type 
    //         FROM classes 
    //         WHERE nom_classe LIKE ?
    //         UNION
    //         SELECT id, nom, prenom, date_naissance, '' AS classe_id, '' AS groupe, '' AS nationalite, '' AS adresse, telephone, '' AS sexe, 'enseignant' AS type 
    //         FROM enseignants 
    //         WHERE nom LIKE ? OR prenom LIKE ?
    //         UNION
    //         SELECT id, etat_scolarite AS nom, '' AS prenom, '' AS date_naissance, '' AS classe_id, '' AS groupe, '' AS nationalite, '' AS adresse, '' AS telephone, '' AS sexe, 'scolarite' AS type 
    //         FROM scolarites 
    //         WHERE etat_scolarite LIKE ?");
    
    //     $stmt->execute(["%$query%", "%$query%", "%$query%", "%$query%", "%$query%", "%$query%"]);
    //     echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    // }

    // if ($_GET['action'] == 'getDetails' && isset($_GET['id']) && isset($_GET['type'])) {
    // $id = $_GET['id'];
    // $type = $_GET['type'];

    //     switch ($type) {
    //         case 'eleve':
    //             $stmt = $pdo->prepare("
    //                 SELECT e.id, e.nom, e.prenom, e.date_naissance, e.classe_id, e.groupe, e.nationalite, e.adresse, e.telephone, e.sexe,
    //                     s.cout_scolarite, s.montant_paye, s.etat_scolarite, 
    //                     (s.cout_scolarite - s.montant_paye) AS reste_a_payer
    //                 FROM eleves e
    //                 LEFT JOIN scolarites s ON e.id = s.eleve_id
    //                 WHERE e.id = ?");
    //             break;
    //         case 'classe':
    //             $stmt = $pdo->prepare("
    //                 SELECT c.id, c.nom_classe AS nom, 
    //                     (SELECT COUNT(*) FROM eleves WHERE classe_id = c.nom_classe) AS total_eleves,
    //                     (SELECT COUNT(*) FROM eleves WHERE classe_id = c.nom_classe AND sexe = 'F') AS total_filles,
    //                     (SELECT COUNT(*) FROM eleves WHERE classe_id = c.nom_classe AND sexe = 'M') AS total_garcons
    //                 FROM classes c 
    //                 WHERE c.id = ?");
    //             break;
    //         case 'enseignant':
    //             $stmt = $pdo->prepare("
    //                 SELECT id, nom, prenom, date_naissance, lieu_naissance, telephone, profession
    //                 FROM enseignants 
    //                 WHERE id = ?");
    //             break;
    //         case 'scolarite':
    //             $stmt = $pdo->prepare("
    //                 SELECT s.id, e.nom, e.prenom, s.cout_scolarite, s.montant_paye, 
    //                     (s.cout_scolarite - s.montant_paye) AS reste_a_payer, 
    //                     s.etat_scolarite, s.date_paiement
    //                 FROM scolarites s
    //                 JOIN eleves e ON s.eleve_id = e.id
    //                 WHERE s.id = ?");
    //             break;
    //         default:
    //             echo json_encode(["error" => "Type invalide"]);
    //             exit;
    //     }

    //     $stmt->execute([$id]);
    //     echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
    // }


    if ($_GET['action'] == 'recherche' && isset($_GET['q']) && isset($_GET['annee_scolaire_id'])) {
        $query = $_GET['q'];
        $anneeScolaireId = $_GET['annee_scolaire_id'];
    
        $stmt = $pdo->prepare("
            SELECT id, nom, prenom, date_naissance, classe_id, groupe, nationalite, adresse, telephone, sexe, 'eleve' AS type 
            FROM eleves 
            WHERE (nom LIKE ? OR prenom LIKE ?) AND annee_scolaire_id = ?
            UNION
            SELECT id, nom_classe AS nom, '' AS prenom, '' AS date_naissance, '' AS classe_id, '' AS groupe, '' AS nationalite, '' AS adresse, '' AS telephone, '' AS sexe, 'classe' AS type 
            FROM classes 
            WHERE nom_classe LIKE ? AND annee_scolaire_id = ?
            UNION
            SELECT id, nom, prenom, date_naissance, '' AS classe_id, '' AS groupe, '' AS nationalite, '' AS adresse, telephone, '' AS sexe, 'enseignant' AS type 
            FROM enseignants 
            WHERE (nom LIKE ? OR prenom LIKE ?) AND annee_scolaire_id = ?
            UNION
            SELECT id, etat_scolarite AS nom, '' AS prenom, '' AS date_naissance, '' AS classe_id, '' AS groupe, '' AS nationalite, '' AS adresse, '' AS telephone, '' AS sexe, 'scolarite' AS type 
            FROM scolarites 
            WHERE etat_scolarite LIKE ? AND annee_scolaire_id = ?
        ");
    
        $stmt->execute(["%$query%", "%$query%", $anneeScolaireId, "%$query%", $anneeScolaireId, "%$query%", "%$query%", $anneeScolaireId, "%$query%", $anneeScolaireId]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    if ($_GET['action'] == 'getDetails' && isset($_GET['id']) && isset($_GET['type']) && isset($_GET['annee_scolaire_id'])) {
        $id = $_GET['id'];
        $type = $_GET['type'];
        $anneeId = $_GET['annee_scolaire_id'];
    
        switch ($type) {
            case 'eleve':
                $stmt = $pdo->prepare("
                    SELECT e.id, e.nom, e.prenom, e.date_naissance, e.classe_id, e.groupe, e.nationalite, e.adresse, e.telephone, e.sexe,
                        s.cout_scolarite, s.montant_paye, s.etat_scolarite, 
                        (s.cout_scolarite - s.montant_paye) AS reste_a_payer
                    FROM eleves e
                    LEFT JOIN scolarites s ON e.id = s.eleve_id AND s.annee_scolaire_id = ?
                    WHERE e.id = ? AND e.annee_scolaire_id = ?");
                $stmt->execute([$anneeId, $id, $anneeId]);
                break;
    
            case 'classe':
                $stmt = $pdo->prepare("
                    SELECT c.id, c.nom_classe AS nom, 
                        (SELECT COUNT(*) FROM eleves WHERE classe_id = c.nom_classe AND annee_scolaire_id = ?) AS total_eleves,
                        (SELECT COUNT(*) FROM eleves WHERE classe_id = c.nom_classe AND sexe = 'F' AND annee_scolaire_id = ?) AS total_filles,
                        (SELECT COUNT(*) FROM eleves WHERE classe_id = c.nom_classe AND sexe = 'M' AND annee_scolaire_id = ?) AS total_garcons
                    FROM classes c 
                    WHERE c.id = ? AND c.annee_scolaire_id = ?");
                $stmt->execute([$anneeId, $anneeId, $anneeId, $id, $anneeId]);
                break;
    
            case 'enseignant':
                $stmt = $pdo->prepare("
                    SELECT id, nom, prenom, date_naissance, lieu_naissance, telephone, profession
                    FROM enseignants 
                    WHERE id = ? AND annee_scolaire_id = ?");
                $stmt->execute([$id, $anneeId]);
                break;
    
            case 'scolarite':
                $stmt = $pdo->prepare("
                    SELECT s.id, e.nom, e.prenom, s.cout_scolarite, s.montant_paye, 
                        (s.cout_scolarite - s.montant_paye) AS reste_a_payer, 
                        s.etat_scolarite, s.date_paiement
                    FROM scolarites s
                    JOIN eleves e ON s.eleve_id = e.id
                    WHERE s.id = ? AND s.annee_scolaire_id = ?");
                $stmt->execute([$id, $anneeId]);
                break;
    
            default:
                echo json_encode(["error" => "Type invalide"]);
                exit;
        }
    
        echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
    }

    

} catch (PDOException $e) {
    echo json_encode(["error" => "Erreur de connexion : " . $e->getMessage()]);
}


?>
