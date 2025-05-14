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

    
    // Pour Les Notifications 
    
    switch ($method) {
        case 'GET':
            if ($action == 'getNotifications') {
                $role = $_GET['role'] ?? 'tous';
                $annee = $_GET['annee_scolaire_id'] ?? '';

                $query = "
                    SELECT n.*, u.nom, u.prenom, u.role AS auteur_role 
                    FROM notifications n
                    JOIN users u ON u.id = n.user_id
                    WHERE (n.cible = ? OR n.cible = 'tous') AND n.annee_scolaire_id = ?
                    ORDER BY n.created_at DESC
                ";

                $stmt = $pdo->prepare($query);
                $stmt->execute([$role, strval($annee)]);
                $data = [];
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                foreach ($result as $row) {
                    $data[] = $row;
                }

                // echo json_encode($data);
                echo json_encode(['notifications' => $data]);
                // var_dump($role, $annee, $result);

                exit;
            }
            break;

        case 'POST':
            if ($action == 'ajouterNotification') {
                $input = json_decode(file_get_contents("php://input"), true);

                if (!isset($input['user_id'], $input['message'], $input['cible'], $input['annee_scolaire_id'])) {
                    echo json_encode(['success' => false, 'error' => 'Champs manquants.']);
                    exit;
                }

                $user_id = (int) $input['user_id'];
                $message = $input['message'];
                $cible = $input['cible'];
                $annee = $input['annee_scolaire_id'];

                $query = "INSERT INTO notifications (user_id, message, cible, annee_scolaire_id, lue)
                        VALUES (?, ?, ?, ?, 0)";

                $stmt = $pdo->prepare($query);
                // $stmt->bindParam("isss", $user_id, $message, $cible, $annee);
                // $stmt->execute([$user_id, $message, $cible, $annee]);

                if ($stmt->execute([$user_id, $message, $cible, $annee])) {
                    echo json_encode(['success' => true]);
                } else {
                    echo json_encode(['success' => false, 'error' => $stmt->error]);
                }

                exit;
            }
            break;

        case 'POST':
            if ($action === 'marquerCommeLue') {
                $data = json_decode(file_get_contents("php://input"), true);
                $id = $data['id'];

                $stmt = $pdo->prepare("UPDATE notifications SET lue = 1 WHERE id = ?");
                $stmt->execute([$id]);

                echo json_encode(["success" => true]);
                exit;
            }
            break;
    }


    //Pour la Bibliothèque

    switch ($method) {
        case 'GET':
            if ($action == 'getLivres') {
                $annee = $_GET['annee_scolaire_id'] ?? '';
                $stmt = $pdo->prepare("SELECT * FROM livres WHERE annee_scolaire_id = ?");
                $stmt->execute([$annee]);
                echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
                exit;
            } else if ($action == 'getEmprunts') {
                $annee = $_GET['annee_scolaire_id'] ?? '';
                $stmt = $pdo->prepare("
                    SELECT e.*, l.titre, l.auteur, el.nom AS eleve_nom, el.prenom AS eleve_prenom
                    FROM emprunts e
                    JOIN livres l ON e.livre_id = l.id
                    JOIN eleves el ON e.eleve_id = el.id
                    WHERE e.annee_scolaire_id = ?
                    ORDER BY e.date_emprunt DESC
                ");
                $stmt->execute([$annee]);
                echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
                exit;
            }
            break;
    
        case 'POST':
            $data = json_decode(file_get_contents("php://input"), true);
    
            if ($action == 'EmprunterLivre') {
                $stmt = $pdo->prepare("INSERT INTO emprunts (livre_id, eleve_id, date_emprunt, statut, annee_scolaire_id) VALUES (?, ?, ?, ?, ?)");
                $stmt->execute([
                    $data['livre_id'],
                    $data['eleve_id'],
                    $data['date_emprunt'],
                    $data['statut'],
                    $data['annee_scolaire_id']
                ]);
    
                $db->exec("UPDATE livres SET disponible = 0 WHERE id = " . intval($data['livre_id']));
                echo json_encode(['success' => true]);
                exit;
    
            } else if ($action == 'retournerLivre') {
                $stmt = $pdo->prepare("UPDATE emprunts SET date_retour = NOW(), statut = 'retourne' WHERE id = ?");
                $stmt->execute([$data['id']]);
    
                $stmt2 = $pdo->prepare("UPDATE livres SET disponible = 1 WHERE id = (SELECT livre_id FROM emprunts WHERE id = ?)");
                $stmt2->execute([$data['id']]);
    
                echo json_encode(['success' => true]);
                exit;
            } else if ($action == 'ajouterLivre') {
                $data = json_decode(file_get_contents("php://input"), true);

                $titre = $data['titre'] ?? '';
        $auteur = $data['auteur'] ?? '';
        $genre = $data['genre'] ?? '';
        $disponible = $data['disponible'] ?? 1;
        $annee_id = $data['annee_scolaire_id'] ?? null;

        if (!$annee_id) {
            echo json_encode(['error' => 'Année scolaire requise']);
            exit;
        }
            
                if (!empty($data['titre']) && !empty($data['auteur']) && !empty($data['annee_scolaire_id'])) {
                    try {
                        $stmt = $pdo->prepare("INSERT INTO livres (titre, auteur, genre, disponible, annee_scolaire_id) VALUES (?, ?, ?, ?, ?)");
                        $stmt->execute([
                            $data['titre'],
                            $data['auteur'],
                            $data['genre'],
                            $data['disponible'],
                            $data['annee_scolaire_id']
                        ]);
            
                        echo json_encode(['success' => true]);
                        exit;
            
                    } catch (PDOException $e) {
                        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
                        exit;
                    }
                }
            }
            break;

        // case 'POST':
            // if ($action == 'ajouterLivre') {
            //     $data = json_decode(file_get_contents("php://input"), true);
        
            //     if (!empty($data['titre']) && !empty($data['auteur']) && !empty($data['annee_scolaire_id'])) {
            //         $stmt = $db->prepare("INSERT INTO livres (titre, auteur, genre, disponible, annee_scolaire_id) VALUES (?, ?, '', 1, ?)");
            //         $stmt->execute([
            //             $data['titre'],
            //             $data['auteur'],
            //             $data['annee_scolaire_id']
            //         ]);
        
            //         echo json_encode(['message' => 'Livre ajouté avec succès']);
            //     } else {
            //         http_response_code(400);
            //         echo json_encode(['message' => 'Champs manquants']);
            //     }
            //     exit;
            // }
        
        case 'PUT':
            if ($action == 'modifierLivre') {
                $data = json_decode(file_get_contents("php://input"), true);
        
                if (!empty($data['id']) && !empty($data['titre']) && !empty($data['auteur'])) {
                    $stmt = $pdo->prepare("UPDATE livres SET titre = ?, auteur = ?, genre = ?, disponible = ? WHERE id = ?");
                    $stmt->execute([
                        $data['titre'],
                        $data['auteur'],
                        $data['genre'] ?? '',
                        $data['disponible'] ?? 1,
                        $data['id']
                    ]);
        
                    echo json_encode(['message' => 'Livre modifié avec succès']);
                } else {
                    http_response_code(400);
                    echo json_encode(['message' => 'Champs manquants']);
                }
                exit;
            }
            break;
        
        case 'DELETE':
            if ($action == 'supprimerLivre') {
                $data = json_decode(file_get_contents("php://input"), true);
        
                if (!empty($data['id'])) {
                    $stmt = $pdo->prepare("DELETE FROM livres WHERE id = ?");
                    $stmt->execute([$data['id']]);
        
                    echo json_encode(['message' => 'Livre supprimé avec succès']);
                } else {
                    http_response_code(400);
                    echo json_encode(['message' => 'ID manquant']);
                }
                exit;
            }
            break;
            
    
        default:
            echo json_encode(['error' => 'Méthode non prise en charge.']);
            break;
    }



} catch (PDOException $e) {
    echo json_encode(["error" => "Erreur de connexion : " . $e->getMessage()]);
}


?>
