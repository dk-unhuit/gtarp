USLife Roleplay Website



Bienvenue sur le site web du serveur USLife Roleplay.


Ce projet est conçu pour être utilisé par les administrateurs et les membres du serveur USLife. Ce guide vous aidera à configurer et à exécuter le site sur votre propre machine.



Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants sur votre machine :

Node.js (version 14.x ou supérieure). Vous pouvez le télécharger depuis le site officiel de Node.js.
MongoDB. Assurez-vous que MongoDB est installé et en cours d'exécution. Si vous utilisez MongoDB Atlas, vous aurez besoin de vos informations de connexion.



Installation
1. Cloner le dépôt

Clonez le dépôt GitHub sur votre machine locale en utilisant la commande appropriée dans votre terminal pour cloner un dépôt Git.

Ensuite, accédez au dossier du projet en utilisant une commande de type cd suivie du nom du dossier.



2. Installer les dépendances

Installez les dépendances Node.js nécessaires en utilisant la commande npm install dans le terminal, après vous être positionné dans le dossier du projet.



3. Configurer les variables d'environnement

Créez un fichier .env à la racine de votre projet. Ce fichier doit contenir les informations suivantes :

MONGO_URI : Entrez ici l'URI de connexion à votre base de données MongoDB.
SECRET_KEY : Choisissez une clé secrète utilisée pour sécuriser les sessions utilisateur.
PORT : Choisissez un port sur lequel le serveur sera exécuté (par défaut, le port est 3000).



4. Exécuter la base de données MongoDB

Si vous utilisez MongoDB localement, démarrez le service MongoDB sur votre machine. Pour les utilisateurs de MongoDB Atlas, assurez-vous que votre cluster est en ligne et accessible.



5. Lancer le serveur

Pour lancer le serveur, exécutez la commande npm start dans le terminal. Le serveur devrait maintenant être en cours d'exécution sur http://localhost:3000/ (ou sur le port que vous avez configuré).

Utilisation

Page d'accueil : Accessible à tous les utilisateurs.
Espace admin : Accès réservé aux utilisateurs ayant le rôle d'admin.
Espace owner : Accès réservé aux utilisateurs ayant le rôle d'owner.



Déploiement

Pour déployer ce site sur un serveur en production, assurez-vous de configurer correctement les variables d'environnement et d'utiliser une base de données MongoDB fiable.



Contribuer

Les contributions sont les bienvenues ! Veuillez soumettre des issues et des pull requests sur le dépôt GitHub pour signaler et corriger les bugs, ajouter des fonctionnalités ou améliorer la documentation.



Licence

Ce projet est sous licence MIT. Pour plus de détails, veuillez consulter le fichier LICENSE dans le dépôt.
