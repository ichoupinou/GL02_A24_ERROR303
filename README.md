# Outil de Gestion et Suivi d'Occupation des Salles de Cours
Destiné aux gestionnaires de locaux de l'Université Centrale de la République de Sealand (SRU), au personnel du service informatique, et aux développeurs impliqués dans la réalisation de l'outil de gestion des salles de cours

## Prérequis

### Dépendances

- Node.js (version 14 ou supérieure)
- npm (gestionnaire de packages Node.js)

### Installation des Dépendances

Clonez le dépôt et installez les packages nécessaires :

```
bash
git clone https://github.com/ichoupinou/GL02_A24_ERROR303.git
cd GL02_A24_ERROR303
npm install 

```

## Packages Requis

- `readline`: Gestion des interactions en ligne de commande
- `fs`: Lecture/écriture de fichiers
- `path`: Manipulation des chemins de fichiers

## Visualisation de Données

### Vega et Vegalite

Installez Vega et Vegalite pour la visualisation :

```bash
bash
npm install vega vega-lite vega-embed

```

Ces bibliothèques sont utilisées notamment pour la SPEC-9 (visualisation du taux d'occupation des salles).

## Structure des Données

Le programme traite des fichiers de type `.cru` contenant les informations des emplois du temps. Le fichier `sample/edttotal_clean.cru` est utilisé comme source de données par défaut.

## Fonctionnalités Principales

1. Recherche de salles par cours
2. Vérification de la capacité maximale des salles
3. Recherche des disponibilités des salles
4. Identification des salles libres à un créneau donné
5. Génération d'un agenda iCalendar
6. Vérification des chevauchements de cours
7. Classement des salles par capacité
8. Visualisation du taux d'occupation des salles

## Lancement de l'Application

```bash
node main.js

```

## Interface Utilisateur

L'application propose un menu interactif en ligne de commande avec plusieurs options numérotées.

## Remarques

- Assurez-vous d'utiliser le fichier `edttotal_clean.cru` ou des données en '.cru' valides
- Les interactions se font via la console
- Suivez les instructions affichées à l'écran

## Dépannage

- Vérifiez que Node.js est correctement installé
- Assurez-vous d'avoir toutes les dépendances installées
- Consultez les messages d'erreur de la console

## Tests Unitaires

## Contributeurs

Anaëlle MELO (anaelle.melo@utt.fr)
Icham LECORVAISIER (icham.lecorvaisier@utt.fr)
Florent PERROUX (florent.perroux@utt.fr)
