-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 16 avr. 2025 à 16:31
-- Version du serveur : 10.4.22-MariaDB
-- Version de PHP : 8.1.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `pro_ecole`
--
CREATE DATABASE IF NOT EXISTS `pro_ecole` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `pro_ecole`;

-- --------------------------------------------------------

--
-- Structure de la table `absences`
--

CREATE TABLE `absences` (
  `id` int(11) UNSIGNED NOT NULL,
  `eleve_id` int(11) UNSIGNED NOT NULL,
  `matiere_id` int(11) UNSIGNED NOT NULL,
  `classe_id` int(11) UNSIGNED NOT NULL,
  `jour` varchar(20) DEFAULT NULL,
  `heure_debut` time DEFAULT NULL,
  `heure_fin` time DEFAULT NULL,
  `date_absence` date DEFAULT NULL,
  `enseignant_id` int(11) UNSIGNED NOT NULL,
  `justifie` varchar(20) DEFAULT NULL,
  `motif_justifie` text DEFAULT NULL,
  `annee_scolaire_id` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `absences`
--

INSERT IGNORE INTO `absences` (`id`, `eleve_id`, `matiere_id`, `classe_id`, `jour`, `heure_debut`, `heure_fin`, `date_absence`, `enseignant_id`, `justifie`, `motif_justifie`, `annee_scolaire_id`) VALUES
(7, 8, 4, 9, 'Samedi', '10:00:00', '12:00:00', '2001-10-10', 15, 'Non', '', '2024-2025'),
(8, 8, 5, 8, 'Samedi', '17:00:00', '18:00:00', '2025-01-15', 15, 'Oui', 'Il avait eu un accident', '2024-2025'),
(9, 12, 8, 11, 'Mardi', '10:00:00', '12:00:00', '2025-01-10', 18, 'Oui', 'Malade', '2');

-- --------------------------------------------------------

--
-- Structure de la table `annees_scolaires`
--

CREATE TABLE `annees_scolaires` (
  `id` int(10) UNSIGNED NOT NULL,
  `annee` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `annees_scolaires`
--

INSERT IGNORE INTO `annees_scolaires` (`id`, `annee`, `created_at`) VALUES
(1, '2024-2025', '2025-03-10 03:47:36'),
(2, '2025-2026', '2025-03-10 15:58:03');

-- --------------------------------------------------------

--
-- Structure de la table `classes`
--

CREATE TABLE `classes` (
  `id` int(11) UNSIGNED NOT NULL,
  `nom_classe` varchar(50) DEFAULT NULL,
  `annee_scolaire_id` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `classes`
--

INSERT IGNORE INTO `classes` (`id`, `nom_classe`, `annee_scolaire_id`) VALUES
(1, 'Seconde L', '2024-2025'),
(2, 'Seconde S', '2024-2025'),
(5, 'Première L', '2024-2025'),
(6, 'Première S', '2024-2025'),
(7, 'Terminal L1', '2024-2025'),
(8, 'Terminal L2', '2024-2025'),
(9, 'Terminal S1', '2024-2025'),
(11, 'Seconde L', '2'),
(12, 'Seconde S', '2'),
(13, 'Première L', '2'),
(14, 'Première S', '2'),
(15, 'Terminal L1', '2'),
(16, 'Terminal L2', '2'),
(17, 'Terminal S1', '2'),
(18, 'Terminal S2', '2');

-- --------------------------------------------------------

--
-- Structure de la table `eleves`
--

CREATE TABLE `eleves` (
  `id` int(11) UNSIGNED NOT NULL,
  `prenom` varchar(50) DEFAULT NULL,
  `nom` varchar(50) DEFAULT NULL,
  `date_naissance` date DEFAULT NULL,
  `classe_id` int(11) UNSIGNED NOT NULL,
  `groupe` varchar(50) DEFAULT NULL,
  `nationalite` varchar(50) DEFAULT NULL,
  `adresse` text DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `sexe` enum('M','F') DEFAULT NULL,
  `annee_scolaire_id` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `eleves`
--

INSERT IGNORE INTO `eleves` (`id`, `prenom`, `nom`, `date_naissance`, `classe_id`, `groupe`, `nationalite`, `adresse`, `telephone`, `sexe`, `annee_scolaire_id`) VALUES
(8, 'Ahmadou', 'Ndiaye', '2025-02-20', 2, 'S_L B', 'Sénégalaise', 'Ndiéfoune', '765600909', 'F', '2024-2025'),
(9, 'Sidy', 'Seck', '2025-02-27', 2, 'Seconde L B', 'Sénégalaise', 'Touba centre', '774521414', 'M', '2024-2025'),
(10, 'Aby', 'Seye', '2025-02-28', 2, 'SLB', 'Sénégalaise', 'Mbédié', '765600909', 'F', '2024-2025'),
(11, 'Abdou', 'Diagne', '2010-04-04', 5, 'P_LA', 'Sénégalaise', 'Touba centre', '765600909', 'M', '2024-2025'),
(12, 'Khadim', 'Dione', '2014-12-10', 11, 'SL-A', 'Sénégalaise', 'Mbédié', '775609949', 'M', '2'),
(13, 'Modou', 'Ndiaye', '2015-05-01', 12, 'SS_A', 'Sénégalaise', 'Mbédié', '761401414', 'M', '2'),
(14, 'Abdou', 'Diagne', '2012-05-17', 11, 'SL_A', 'Sénégalaise', 'Touba centre', '765600909', 'M', '2'),
(15, 'Binetou', 'Dièye', '2005-10-04', 11, 'SL_A', 'Sénégalaise', 'Keur Thiaf', '785525421', 'F', '2');

-- --------------------------------------------------------

--
-- Structure de la table `emargements`
--

CREATE TABLE `emargements` (
  `id` int(11) UNSIGNED NOT NULL,
  `enseignant_id` int(11) UNSIGNED NOT NULL,
  `matiere_id` int(11) UNSIGNED NOT NULL,
  `titre_cours` varchar(100) DEFAULT NULL,
  `date_heure` datetime DEFAULT NULL,
  `semestre` enum('1','2') NOT NULL,
  `classe_id` int(11) UNSIGNED NOT NULL,
  `annee_scolaire_id` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `emargements`
--

INSERT IGNORE INTO `emargements` (`id`, `enseignant_id`, `matiere_id`, `titre_cours`, `date_heure`, `semestre`, `classe_id`, `annee_scolaire_id`) VALUES
(1, 18, 8, 'Introduction de la poésie', '2025-01-10 10:00:00', '1', 12, '2');

-- --------------------------------------------------------

--
-- Structure de la table `emplois_temps`
--

CREATE TABLE `emplois_temps` (
  `id` int(11) NOT NULL,
  `classe_id` int(10) UNSIGNED NOT NULL,
  `jour` varchar(20) DEFAULT NULL,
  `heure` time NOT NULL,
  `matiere_id` int(10) UNSIGNED NOT NULL,
  `annee_scolaire_id` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `emplois_temps`
--

INSERT IGNORE INTO `emplois_temps` (`id`, `classe_id`, `jour`, `heure`, `matiere_id`, `annee_scolaire_id`) VALUES
(64, 11, 'Lundi', '08:00:00', 8, '2'),
(65, 11, 'Lundi', '09:00:00', 8, '2'),
(66, 11, 'Mardi', '08:00:00', 9, '2'),
(67, 11, 'Mardi', '09:00:00', 9, '2'),
(68, 11, 'Mardi', '10:00:00', 10, '2'),
(69, 11, 'Mardi', '11:00:00', 10, '2'),
(70, 11, 'Mercredi', '08:00:00', 11, '2'),
(71, 11, 'Mercredi', '09:00:00', 11, '2'),
(72, 11, 'Mercredi', '10:00:00', 10, '2'),
(73, 11, 'Mercredi', '11:00:00', 10, '2'),
(74, 11, 'Jeudi', '09:00:00', 8, '2'),
(75, 11, 'Jeudi', '10:00:00', 8, '2'),
(76, 11, 'Vendredi', '08:00:00', 11, '2'),
(77, 11, 'Vendredi', '09:00:00', 11, '2'),
(78, 11, 'Vendredi', '10:00:00', 9, '2'),
(79, 11, 'Vendredi', '11:00:00', 9, '2');

-- --------------------------------------------------------

--
-- Structure de la table `enseignants`
--

CREATE TABLE `enseignants` (
  `id` int(11) UNSIGNED NOT NULL,
  `prenom` varchar(50) DEFAULT NULL,
  `nom` varchar(50) DEFAULT NULL,
  `date_naissance` date DEFAULT NULL,
  `lieu_naissance` varchar(50) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `profession` varchar(100) DEFAULT NULL,
  `annee_scolaire_id` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `enseignants`
--

INSERT IGNORE INTO `enseignants` (`id`, `prenom`, `nom`, `date_naissance`, `lieu_naissance`, `telephone`, `profession`, `annee_scolaire_id`) VALUES
(15, 'Khadim', 'Dione', '2010-10-10', 'Mbédié', '765564147', 'Professeur Math', '2024-2025'),
(16, 'Bamba', 'Dione', '2022-10-10', 'Keur lamane', '765564147', 'Professeur Hist/Géo', '2024-2025'),
(17, 'Cheikh Bamba', 'DIONE', '1998-11-11', 'Touba toul', '765600909', 'ProfesseurHG', '2024-2025'),
(18, 'Moussa', 'Cissé', '2010-10-10', 'Pikine', '764414141', 'Mathématique', '2'),
(19, 'Modou', 'Fall', '1987-05-14', 'Diamaguène', '762441414', 'Anglais', '2');

-- --------------------------------------------------------

--
-- Structure de la table `matieres`
--

CREATE TABLE `matieres` (
  `id` int(10) UNSIGNED NOT NULL,
  `nom` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `annee_scolaire_id` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `matieres`
--

INSERT IGNORE INTO `matieres` (`id`, `nom`, `description`, `annee_scolaire_id`) VALUES
(1, 'Français', 'Connaissance en langue française', '2024-2025'),
(2, 'Anglais', 'Connaissance en langue Anglaise', '2024-2025'),
(3, 'Mathématique', 'Avoir des connaissances absolues en mathématique', '2024-2025'),
(4, 'Espagnol', 'Apprentissage de la langue espagnole', '2024-2025'),
(5, 'Physique/Chimie', 'Connaissanse en Physique et en chimie', '2024-2025'),
(6, 'SVT ', 'Connaissance en science de la vie et de la terre', '2024-2025'),
(7, 'Arabe', 'Connaissance en langue Arabe', '2024-2025'),
(8, 'Mathématiques', 'connaissance claire en mathématque', '2'),
(9, 'Français', 'Connaissance en langue Française', '2'),
(10, 'Physique/Chimie', 'Connaissance en science physique et chimie', '2'),
(11, 'Anglais', 'Connaissance en langue anglaise', '2');

-- --------------------------------------------------------

--
-- Structure de la table `notes`
--

CREATE TABLE `notes` (
  `id` int(10) UNSIGNED NOT NULL,
  `eleve_id` int(10) UNSIGNED NOT NULL,
  `classe_id` int(10) UNSIGNED NOT NULL,
  `matiere_id` int(10) UNSIGNED NOT NULL,
  `enseignant_id` int(10) UNSIGNED NOT NULL,
  `semestre` enum('1','2') NOT NULL,
  `devoir1` decimal(5,2) DEFAULT NULL,
  `devoir2` decimal(5,2) DEFAULT NULL,
  `composition` decimal(5,2) DEFAULT NULL,
  `coefficient` int(11) NOT NULL DEFAULT 1,
  `annee_scolaire_id` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `notes`
--

INSERT IGNORE INTO `notes` (`id`, `eleve_id`, `classe_id`, `matiere_id`, `enseignant_id`, `semestre`, `devoir1`, `devoir2`, `composition`, `coefficient`, `annee_scolaire_id`) VALUES
(1, 9, 8, 3, 16, '2', '14.00', '15.00', '13.00', 2, '2024-2025'),
(4, 12, 11, 9, 18, '1', '10.00', '12.00', '10.00', 4, '2'),
(5, 12, 11, 10, 18, '1', '10.00', '12.00', '14.00', 2, '2'),
(6, 12, 11, 11, 18, '1', '12.00', '17.00', '16.00', 3, '2'),
(7, 13, 12, 8, 18, '1', '15.00', '14.00', '13.00', 5, '2'),
(8, 13, 12, 10, 18, '1', '12.00', '16.00', '17.00', 6, '2'),
(9, 13, 12, 9, 18, '1', '12.00', '9.00', '10.00', 2, '2'),
(10, 14, 11, 9, 19, '1', '14.00', '15.00', '16.00', 4, '2'),
(11, 14, 11, 10, 19, '1', '12.00', '12.00', '13.00', 2, '2'),
(12, 14, 11, 11, 19, '1', '17.00', '15.00', '11.00', 3, '2'),
(13, 15, 11, 9, 19, '1', '10.00', '11.00', '14.00', 4, '2'),
(14, 15, 11, 10, 19, '1', '15.00', '14.00', '10.00', 2, '2'),
(15, 15, 11, 11, 18, '1', '16.00', '18.00', '13.00', 3, '2');

-- --------------------------------------------------------

--
-- Structure de la table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) UNSIGNED NOT NULL,
  `user_id` int(11) UNSIGNED NOT NULL,
  `message` longtext DEFAULT NULL,
  `cible` enum('admin','enseignant','eleve','tous') DEFAULT 'tous',
  `annee_scolaire_id` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `lue` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `notifications`
--

INSERT IGNORE INTO `notifications` (`id`, `user_id`, `message`, `cible`, `annee_scolaire_id`, `created_at`, `lue`) VALUES
(9, 13, '# Le Règlement Intérieur : Une Nécessité Pour Un Environnement Harmonieux\n\nDans tout cadre, qu\'il soit scolaire, professionnel ou associatif, le règlement intérieur joue un rôle crucial dans l\'organisation et le bon fonctionnement des interactions. Souven', 'tous', '2', '2025-04-14 21:20:28', 0),
(10, 13, 'Bonjour,\nJe me demande s\'il y a cours demain', 'tous', '2', '2025-04-14 21:24:14', 0),
(11, 15, 'Tableau de bord avec les statistiques générales (total des élèves enregistrés, total des garçons inscrits, total des filles inscrites, total des classes                                                                              En bas on a : \nInfo: bout', 'tous', '2', '2025-04-15 14:07:44', 0),
(12, 15, ' Tableau de bord avec les statistiques générales (total des élèves enregistrés, total des garçons inscrits, total des filles inscrites, total des classes                                                                              En bas on a : \nInfo: bouton :                                                                                                                                    10 Derniers enregistrés: liste des élèves des 10 derniers inscrits avec les options : Prénom, Nom, Classe, Coût, Adresse, Téléphone, Sexe, Action : modifier ou supprimer                                                                                                      Statistique scolarité: les élèves qui on t payé leur inscriptions : donné le nombre \nLes élèves qui n\'ont pas effectué leur frais d\'inscription : donnez le nombre).\nMenu latéral contenant :\nTableau de bord                                                                            Filtrage: par année scolaire, par classe, Groupe, par Nationalité et  ensuite les boutons Chercher et Imprimer\n*Élèves*: ( Lister les élèves avec les options : Details, Prénom, Nom, Date de Naissance,  Classe, Groupe, Nationalité,  Adresse, Téléphone, Sexe, Action : modifier ou supprimer), bouton Ajout un élève, Re/inscrire un élève, Details: Listes des élèves inscrits\n*Scolarité*: Bouton Ajout : Payer Le scolarité,                                Liste des Scolarités( ID, Elève: prénom nom, classe, sexe, Coût scolarité, Montant payé, Reste à payer, Etat Scolarité, Action : modifier, supprimer \n*Enseignants*: Bouton Ajout un enseignant, Liste des enseignants(Détails, Pénom, Nom, Date de Naissance, lieu de naissance, téléphone, Profession ex: Prof français, Photo, Action: modifier ou supprimer\n*Emargements*: Bouton Ajout un Emergement, LIste des Emergements(ID, Enseignant: prenom nom, classe, Matière, Titre du cours, Date et Heure Emergement, Semestre, Année scolaire, Action: modifier ou supprimer\n*Notes*: Bouton Ajout une note, Liste des notes (ID, Elève: prenom nom, Metière, Devoir 1, Devoir 2, composition, coéfficient, Enseignant, Action : modifier ou supprimer\n*Classe*: Bouton Ajout une classe, Liste des classes ( ID, Classe)                                                                                               *Absence* : Bouton Ajout absence/retard, Liste des absences(ID, Elève: prenom nom, Matière, Classe, heure debut heure de fin, Date, Professeur, Action: modifier supprimer\n*Emploi du temps * : Bouton Ajout un emplois du temps , Liste des emplois du temps( Jour, Heure de début, heure de fin, Matière, Classe, Enseignant, Action: modifier ou supprimer\nOptions en haut à droite avec : Topbar\nRecherche (pour faire une recherche sur l\'application aux données existantes)\nHorodatage(Date et heure du jour)                                                                                               Paramètre: lien( créer une année scolaire, créer une classe, ajouter une matière, créer un triestre\nProfil utilisateur (lien connexion ou deconnexion\nDonner moi le code complet  l\'application et de la base de données et qu\'elle soit codée en angular comme frontend et Mysql pour le backend et php pour recupérer et envoi des données sur la base de données                                                                                                                N\'oublé d\'avoir un bon style de l\'application, du tableau de bord et du topbar; d\'avoir un bon style sur les couleurs comme l\'image; de respecter tous les boutons \n\navatar\nCréer une application complète avec Angular en tant que front-end, PHP en tant que back-end et MySQL pour la base de données est un projet d\'envergure. Je vais fournir un aperçu de l\'architecture et quelques exemples de code pour vous aider à démarrer. Cependant, en raison de la complexité du projet, je fournirai une structure simplifiée pour chaque partie. Vous devrez développer davantage chaque section en fonction de vos exigences spécifiques', 'tous', '2', '2025-04-15 15:10:10', 0),
(13, 13, 'Bonsoir,\njaimerais vous faire savoir que demain il n y aura pas cours ', 'tous', '2', '2025-04-15 23:24:40', 0),
(14, 13, 'Chers élèves les cours vaiqueront demain à partir de 13h', 'tous', '2', '2025-04-16 01:03:19', 0),
(15, 16, 'Bonjours est-ce que je peux changer la classe de seconde L', 'admin', '2', '2025-04-16 13:10:17', 0),
(16, 16, 'Bonsoir,\nj\'aimerais vous faire savoir que demain il n y aura pas cours', 'tous', '2', '2025-04-16 13:16:45', 0);

-- --------------------------------------------------------

--
-- Structure de la table `scolarites`
--

CREATE TABLE `scolarites` (
  `id` int(11) UNSIGNED NOT NULL,
  `eleve_id` int(11) UNSIGNED NOT NULL,
  `cout_scolarite` decimal(10,2) DEFAULT NULL,
  `montant_paye` decimal(10,2) DEFAULT NULL,
  `reste_a_payer` decimal(10,2) DEFAULT NULL,
  `etat_scolarite` enum('payé','non payé','partiellement payé') DEFAULT NULL,
  `date_paiement` date DEFAULT NULL,
  `annee_scolaire_id` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `scolarites`
--

INSERT IGNORE INTO `scolarites` (`id`, `eleve_id`, `cout_scolarite`, `montant_paye`, `reste_a_payer`, `etat_scolarite`, `date_paiement`, `annee_scolaire_id`) VALUES
(1, 11, '18000.00', '18000.00', '0.00', 'payé', '2025-02-22', '2024-2025'),
(15, 9, '15000.00', '15000.00', '0.00', 'payé', '2025-02-23', '2024-2025'),
(18, 8, '17000.00', '10000.00', '7000.00', 'partiellement payé', '2025-02-23', '2024-2025'),
(19, 12, '15000.00', '15000.00', '0.00', 'payé', '2025-03-16', '2'),
(20, 12, '18000.00', '10000.00', '8000.00', 'partiellement payé', '2025-03-17', '2'),
(21, 13, '20000.00', '10000.00', '10000.00', 'partiellement payé', '2025-03-17', '2'),
(22, 13, '18000.00', '18000.00', '0.00', 'payé', '2025-03-17', '2');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) UNSIGNED NOT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','enseignant','eleve') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `annee_scolaire_id` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `users`
--

INSERT IGNORE INTO `users` (`id`, `nom`, `prenom`, `email`, `password`, `role`, `created_at`, `annee_scolaire_id`) VALUES
(12, 'Dione', 'khadim', 'khadimdione92@gmail.com', '$2y$10$3j9pGBY3xr6YEntl70YBOuxW.0avoPOgXVow2UpIJlsyoULPfIj1m', 'admin', '2025-03-03 15:50:49', '2024-2025'),
(13, 'Dione', 'Khadim', 'admin@gmail.com', '$2y$10$QJLqR2KX3rSZF2v/9xx3PewynOO9FoL1d6kxe/DFHKRQjluwA6SnG', 'admin', '2025-03-27 21:22:29', '2'),
(15, 'Ndiaye', 'Modou', 'eleve@gmail.com', '$2y$10$gf3bLq5pNXxArhewN9VKTuH8X9lst.lvd8lMkNeQ7wYeHBBIcQIqq', 'eleve', '2025-04-06 10:54:55', '2'),
(16, 'Diop', 'Doudou', 'enseignant@gmail.com', '$2y$10$RgxmlUoBnh0My3dx936aPOphiaoV5WyZUJaBHZ6MllnU4P.YrYd.O', 'enseignant', '2025-04-07 21:27:58', '2');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `absences`
--
ALTER TABLE `absences`
  ADD PRIMARY KEY (`id`),
  ADD KEY `eleve_id` (`eleve_id`),
  ADD KEY `enseignant_id` (`enseignant_id`),
  ADD KEY `classe_id` (`classe_id`);

--
-- Index pour la table `annees_scolaires`
--
ALTER TABLE `annees_scolaires`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `annee` (`annee`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Index pour la table `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `eleves`
--
ALTER TABLE `eleves`
  ADD PRIMARY KEY (`id`),
  ADD KEY `classe_id` (`classe_id`);

--
-- Index pour la table `emargements`
--
ALTER TABLE `emargements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `enseignant_id` (`enseignant_id`),
  ADD KEY `matiere_id` (`matiere_id`),
  ADD KEY `classe_id` (`classe_id`);

--
-- Index pour la table `emplois_temps`
--
ALTER TABLE `emplois_temps`
  ADD PRIMARY KEY (`id`),
  ADD KEY `classe_id` (`classe_id`),
  ADD KEY `matiere_id` (`matiere_id`);

--
-- Index pour la table `enseignants`
--
ALTER TABLE `enseignants`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `matieres`
--
ALTER TABLE `matieres`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `notes`
--
ALTER TABLE `notes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `eleve_id` (`eleve_id`),
  ADD KEY `classe_id` (`classe_id`),
  ADD KEY `matiere_id` (`matiere_id`),
  ADD KEY `enseignant_id` (`enseignant_id`);

--
-- Index pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `scolarites`
--
ALTER TABLE `scolarites`
  ADD PRIMARY KEY (`id`),
  ADD KEY `eleve_id` (`eleve_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `absences`
--
ALTER TABLE `absences`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `annees_scolaires`
--
ALTER TABLE `annees_scolaires`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `classes`
--
ALTER TABLE `classes`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT pour la table `eleves`
--
ALTER TABLE `eleves`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT pour la table `emargements`
--
ALTER TABLE `emargements`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `emplois_temps`
--
ALTER TABLE `emplois_temps`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=80;

--
-- AUTO_INCREMENT pour la table `enseignants`
--
ALTER TABLE `enseignants`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT pour la table `matieres`
--
ALTER TABLE `matieres`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `notes`
--
ALTER TABLE `notes`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT pour la table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT pour la table `scolarites`
--
ALTER TABLE `scolarites`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `absences`
--
ALTER TABLE `absences`
  ADD CONSTRAINT `absences_ibfk_1` FOREIGN KEY (`eleve_id`) REFERENCES `eleves` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `absences_ibfk_2` FOREIGN KEY (`enseignant_id`) REFERENCES `enseignants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `absences_ibfk_3` FOREIGN KEY (`classe_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `eleves`
--
ALTER TABLE `eleves`
  ADD CONSTRAINT `eleves_ibfk_1` FOREIGN KEY (`classe_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `emargements`
--
ALTER TABLE `emargements`
  ADD CONSTRAINT `emargements_ibfk_1` FOREIGN KEY (`enseignant_id`) REFERENCES `enseignants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `emargements_ibfk_2` FOREIGN KEY (`matiere_id`) REFERENCES `matieres` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `emargements_ibfk_3` FOREIGN KEY (`classe_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `emplois_temps`
--
ALTER TABLE `emplois_temps`
  ADD CONSTRAINT `emplois_temps_ibfk_1` FOREIGN KEY (`classe_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `emplois_temps_ibfk_2` FOREIGN KEY (`matiere_id`) REFERENCES `matieres` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `notes`
--
ALTER TABLE `notes`
  ADD CONSTRAINT `notes_ibfk_1` FOREIGN KEY (`eleve_id`) REFERENCES `eleves` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notes_ibfk_2` FOREIGN KEY (`classe_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notes_ibfk_3` FOREIGN KEY (`matiere_id`) REFERENCES `matieres` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notes_ibfk_4` FOREIGN KEY (`enseignant_id`) REFERENCES `enseignants` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `scolarites`
--
ALTER TABLE `scolarites`
  ADD CONSTRAINT `scolarites_ibfk_1` FOREIGN KEY (`eleve_id`) REFERENCES `eleves` (`id`) ON DELETE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
