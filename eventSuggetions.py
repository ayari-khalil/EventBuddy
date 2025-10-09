# from flask import Flask, jsonify, request
# from flask_pymongo import PyMongo
# from bson import ObjectId
# from sklearn.ensemble import RandomForestClassifier
# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.metrics.pairwise import cosine_similarity
# from sklearn.model_selection import train_test_split
# from sklearn.preprocessing import LabelEncoder
# import numpy as np
# import pandas as pd

# app = Flask(__name__)
# app.config["MONGO_URI"] = "mongodb://localhost:27017/eventbuddy"
# mongo = PyMongo(app)

# # --- Helper ---
# def serialize_doc(doc):
#     doc["_id"] = str(doc["_id"])
#     return doc


# # --- Entraînement du modèle ---
# def train_ml_model():
#     """
#     Entraîne un modèle de prédiction d’intérêt utilisateur pour les événements
#     à partir des interactions historiques.
#     """
#     interactions = list(mongo.db.interactions.find())  # Ex: {user_id, event_id, liked: 0/1}

#     if len(interactions) < 10:
#         print("⚠️ Pas assez de données pour l'entraînement ML.")
#         return None, None, None

#     df = pd.DataFrame(interactions)

#     # Charger infos users & events
#     users = {str(u["_id"]): u for u in mongo.db.users.find()}
#     events = {str(e["_id"]): e for e in mongo.db.events.find()}

#     # Préparer les features
#     user_texts, event_texts, labels = [], [], []

#     for _, row in df.iterrows():
#         user = users.get(str(row["user_id"]))
#         event = events.get(str(row["event_id"]))
#         if not user or not event:
#             continue

#         u_text = " ".join(user.get("interests", [])) + " " + user.get("location", "")
#         e_text = (event.get("title", "") or "") + " " + (event.get("description", "") or "")
#         user_texts.append(u_text)
#         event_texts.append(e_text)
#         labels.append(row.get("liked", 0))

#     # Fusion des textes
#     combined = [u + " " + e for u, e in zip(user_texts, event_texts)]

#     # TF-IDF
#     vectorizer = TfidfVectorizer(stop_words="english")
#     X = vectorizer.fit_transform(combined)
#     y = np.array(labels)

#     # Train/test split
#     X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

#     # Modèle ML
#     model = RandomForestClassifier(n_estimators=100, random_state=42)
#     model.fit(X_train, y_train)

#     print("✅ Modèle entraîné avec succès.")
#     return model, vectorizer, users

# @app.route("/api/events", methods=["GET"])
# def get_events():
#     events = list(mongo.db.events.find())
#     for e in events:
#         e["_id"] = str(e["_id"])
#     return jsonify(events)
# # --- API ---
# @app.route("/ai_suggest_events/<user_id>", methods=["GET"])
# def ai_suggest_events(user_id):
#     user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
#     if not user:
#         return jsonify({"error": "User not found"}), 404

#     # Charger modèle
#     model, vectorizer, _ = train_ml_model()
#     if model is None:
#         return jsonify({"error": "Not enough data for AI training"}), 400

#     # Charger tous les événements
#     events = list(mongo.db.events.find())
#     if not events:
#         return jsonify({"error": "No events found"}), 404

#     # Préparer les features pour prédiction
#     user_text = " ".join(user.get("interests", [])) + " " + user.get("location", "")
#     event_texts = [
#         (e.get("title", "") or "") + " " + (e.get("description", "") or "") for e in events
#     ]
#     combined = [user_text + " " + e for e in event_texts]

#     X_pred = vectorizer.transform(combined)
#     probs = model.predict_proba(X_pred)[:, 1]  # Probabilité d'intérêt

#     # Classer les événements
#     ranked = sorted(zip(events, probs), key=lambda x: x[1], reverse=True)

#     # Top 6
#     suggestions = []
#     for e, score in ranked[:6]:
#         ev = serialize_doc(e)
#         ev["ai_score"] = round(float(score), 3)
#         suggestions.append(ev)

#     return jsonify({
#         "user": str(user["_id"]),
#         "suggested_events": suggestions
#     })
    
    


# if __name__ == "__main__":
#     app.run(debug=True)



 
from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from bson import ObjectId
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/eventbuddy"
mongo = PyMongo(app)

# --- Helper ---
def serialize_doc(doc):
    doc["_id"] = str(doc["_id"])
    return doc


@app.route("/ai_suggest_events/<user_id>", methods=["GET"])
def ai_suggest_events(user_id):
    # Récupérer utilisateur
    user = mongo.db.users.find_one({"user_id": user_id})
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Construire un profil texte pour l'utilisateur
    user_text = " ".join(user.get("interests", [])) + " " + \
                " ".join(user.get("goals", [])) + " " + \
                (user.get("bio", "") or "")

    # Récupérer tous les événements
    events = list(mongo.db.events.find())
    if not events:
        return jsonify({"error": "No events found"}), 404

    # Construire les textes des événements
    event_texts = []
    for e in events:
        txt = " ".join(e.get("topics", [])) + " " + \
              (e.get("title", "") or "") + " " + \
              (e.get("description", "") or "")
        event_texts.append(txt)

    # Vectorisation TF-IDF
    vectorizer = TfidfVectorizer(stop_words="english")
    vectors = vectorizer.fit_transform([user_text] + event_texts)

    # Similarité cosinus entre user et chaque event
    user_vec = vectors[0]
    event_vecs = vectors[1:]
    similarities = cosine_similarity(user_vec, event_vecs).flatten()

    # Classer les événements par pertinence
    ranked_events = sorted(zip(events, similarities), key=lambda x: x[1], reverse=True)

    # Top 5 suggestions
    suggestions = []
    for e, score in ranked_events[:6]:
        ev = serialize_doc(e)
        ev["score"] = float(score)
        suggestions.append(ev)

    return jsonify({
        "user": str(user["_id"]),
        "suggested_events": suggestions
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
