# 🎉 EventBuddy

EventBuddy est une application web permettant de gérer et de participer à des événements.  
Le projet est structuré en deux parties principales : **Backend (Node.js / Express)** et **Frontend (React.js)**.

---

## 🚀 Fonctionnalités

- Authentification des utilisateurs (inscription / connexion)
- Création, modification et suppression d’événements
- Participation et gestion des invités
- Affichage de la liste des événements
- API REST sécurisée
- Interface utilisateur moderne et responsive

---

## 🛠️ Stack technique

### Frontend
- ⚛️ React.js
- Redux Toolkit (gestion d’état)
- Axios (requêtes HTTP)
- TailwindCSS / Material UI (UI)

### Backend
- 🟢 Node.js avec Express
- MongoDB avec Mongoose
- JWT pour l’authentification
- bcrypt pour le hash des mots de passe

---

## 📂 Structure du projet

EventBuddy/
│── backend/ # Code du serveur Node.js (API REST)
│ ├── models/ # Modèles Mongoose
│ ├── routes/ # Routes API
│ ├── controllers/# Logique métier
│ └── server.js # Point d’entrée backend
│
│── frontend/ # Code client React.js
│ ├── src/
│ │ ├── components/ # Composants UI
│ │ ├── pages/ # Pages principales
│ │ └── store/ # Redux store
│ └── package.json
│
└── README.md # Documentation

yaml
Copy
Edit

---

## ⚙️ Installation

### 1️⃣ Cloner le projet
```bash
git clone https://github.com/ayari-khalil/EventBuddy.git
cd EventBuddy
2️⃣ Backend (API)
bash
Copy
Edit
cd backend
npm install
npm start
Par défaut, le backend démarre sur http://localhost:5000.

3️⃣ Frontend (React)
bash
Copy
Edit
cd frontend
npm install
npm start
Le frontend démarre sur http://localhost:3000.

🔑 Variables d’environnement
Créer un fichier .env dans backend/ avec les clés suivantes :

env
Copy
Edit
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
📌 Commandes utiles
Backend
bash
Copy
Edit
npm run dev    # Démarrer en mode développement
npm start      # Démarrer en production
Frontend
bash
Copy
Edit
npm start      # Lancer l’application React
npm run build  # Générer une version de production
👥 Contributeurs
@ayari-khalil