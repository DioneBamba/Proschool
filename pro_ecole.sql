-- Création de la base de données
CREATE DATABASE IF NOT EXISTS proschool;
USE proschool;

-- Table `classes`
CREATE TABLE classes (
  id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  nom_classe VARCHAR(50) DEFAULT NULL,
  description TEXT DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table `eleves`
CREATE TABLE eleves (
  id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  prenom VARCHAR(50) DEFAULT NULL,
  nom VARCHAR(50) DEFAULT NULL,
  date_naissance DATE DEFAULT NULL,
  classe_id INT(11) UNSIGNED NOT NULL,
  groupe VARCHAR(50) DEFAULT NULL,
  nationalite VARCHAR(50) DEFAULT NULL,
  adresse TEXT DEFAULT NULL,
  telephone VARCHAR(20) DEFAULT NULL,
  sexe ENUM('M', 'F') DEFAULT NULL,
  cout_scolarite DECIMAL(10,2) DEFAULT NULL,
  montant_paye DECIMAL(10,2) DEFAULT 0.00,
  PRIMARY KEY (id),
  FOREIGN KEY (classe_id) REFERENCES classes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table `enseignants`
CREATE TABLE enseignants (
  id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  prenom VARCHAR(50) DEFAULT NULL,
  nom VARCHAR(50) DEFAULT NULL,
  date_naissance DATE DEFAULT NULL,
  lieu_naissance VARCHAR(50) DEFAULT NULL,
  telephone VARCHAR(20) DEFAULT NULL,
  profession VARCHAR(100) DEFAULT NULL,
  photo VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table `matieres`
CREATE TABLE matieres (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  nom VARCHAR(255) NOT NULL,
  description TEXT DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table `scolarites`
CREATE TABLE scolarites (
  id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  eleve_id INT(11) UNSIGNED NOT NULL,
  date_naissance DATE DEFAULT NULL,
  sexe ENUM('M', 'F') DEFAULT NULL,
  classe_id INT(11) UNSIGNED NOT NULL,
  cout_scolarite DECIMAL(10,2) DEFAULT NULL,
  montant_paye DECIMAL(10,2) DEFAULT NULL,
  reste_a_payer DECIMAL(10,2) DEFAULT NULL,
  etat_scolarite ENUM('payé', 'non payé', 'partillement payé') DEFAULT NULL,
  date_paiement DATE DEFAULT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (eleve_id) REFERENCES eleves(id) ON DELETE CASCADE,
  FOREIGN KEY (classe_id) REFERENCES classes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table `absences`
CREATE TABLE absences (
  id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  eleve_id INT(11) UNSIGNED NOT NULL,
  matiere_id INT(11) UNSIGNED NOT NULL,
  classe_id INT(11) UNSIGNED NOT NULL,
  jour varchar(20) DEFAULT NULL,
  heure_debut TIME DEFAULT NULL,
  heure_fin TIME DEFAULT NULL,
  date_absence DATE DEFAULT NULL,
  enseignant_id INT(11) UNSIGNED NOT NULL,
  justifie varchar(20) DEFAULT NULL,
  motif_justifie text DEFAULT NULL
  PRIMARY KEY (id),
  FOREIGN KEY (eleve_id) REFERENCES eleves(id) ON DELETE CASCADE,
  FOREIGN KEY (matiere_id) REFERENCES matiere(id) ON DELETE CASCADE,
  FOREIGN KEY (enseignant_id) REFERENCES enseignants(id) ON DELETE CASCADE,
  FOREIGN KEY (classe_id) REFERENCES classes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table `emargements`
CREATE TABLE emargements (
  id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  enseignant_id INT(11) UNSIGNED NOT NULL,
  matiere_id INT(11) UNSIGNED NOT NULL,
  titre_cours VARCHAR(100) DEFAULT NULL,
  date_heure DATETIME DEFAULT NULL,
  semestre ENUM('1', '2') NOT NULL,
  annee_scolaire VARCHAR(50) DEFAULT NULL,
  classe_id INT(11) UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (enseignant_id) REFERENCES enseignants(id) ON DELETE CASCADE,
  FOREIGN KEY (matiere_id) REFERENCES matiere(id) ON DELETE CASCADE,
  FOREIGN KEY (classe_id) REFERENCES classes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table `emplois_temps`
CREATE TABLE emplois_temps (
  id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  jour VARCHAR(20) DEFAULT NULL,
  heure_debut TIME DEFAULT NULL,
  heure_fin TIME DEFAULT NULL,
  matiere VARCHAR(100) DEFAULT NULL,
  enseignant_id INT(11) UNSIGNED NOT NULL,
  classe_id INT(11) UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (enseignant_id) REFERENCES enseignants(id) ON DELETE CASCADE,
  FOREIGN KEY (classe_id) REFERENCES classes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table `users`
CREATE TABLE users (
  id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'enseignant', 'eleve') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table `notes`
CREATE TABLE notes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  eleve_id INT UNSIGNED NOT NULL,
  classe_id INT UNSIGNED NOT NULL,
  matiere_id INT UNSIGNED NOT NULL,
  enseignant_id INT UNSIGNED NOT NULL,
  semestre ENUM('1', '2') NOT NULL,
  devoir1 DECIMAL(5,2) DEFAULT NULL,
  devoir2 DECIMAL(5,2) DEFAULT NULL,
  composition DECIMAL(5,2) DEFAULT NULL,
  coefficient INT NOT NULL DEFAULT 1,
  
  FOREIGN KEY (eleve_id) REFERENCES eleves(id) ON DELETE CASCADE,
  FOREIGN KEY (classe_id) REFERENCES classes(id) ON DELETE CASCADE,
  FOREIGN KEY (matiere_id) REFERENCES matieres(id) ON DELETE CASCADE,
  FOREIGN KEY (enseignant_id) REFERENCES enseignants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;







creer moi cela :
L’utilisateur sélectionne une année scolaire dans le menu déroulant.
L’application charge uniquement les données correspondant à cette année via l’API.
Les données affichées dans le tableau de bord sont mises à jour dynamiquement.
Avec cette approche, chaque année scolaire fonctionne indépendamment. Lorsque tu passes à une nouvelle année, les données affichées repartent à zéro, tout en conservant les anciennes années accessibles.  voici les noms des table de ma bases de données : absences, classes , eleves, emargements, emplois_temps, enseignants, matieres, notes, scolarites, users