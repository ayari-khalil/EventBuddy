import express from "express";
import * as eventController from "../controllers/eventController.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// 🔍 DEBUG: Vérifier la clé API au démarrage
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("🔑 Vérification de la clé Gemini API:");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
if (process.env.GEMINI_API_KEY) {
  const keyPreview = process.env.GEMINI_API_KEY.substring(0, 8) + "..." + 
                     process.env.GEMINI_API_KEY.substring(process.env.GEMINI_API_KEY.length - 4);
  console.log(`✅ Clé trouvée: ${keyPreview}`);
  console.log(`📏 Longueur: ${process.env.GEMINI_API_KEY.length} caractères`);
  console.log(`🔤 Commence par: ${process.env.GEMINI_API_KEY.substring(0, 4)}`);
} else {
  console.log("❌ ERREUR: GEMINI_API_KEY non trouvée dans process.env");
  console.log("⚠️  Vérifiez votre fichier .env");
}
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

// Initialiser Gemini AI avec gestion d'erreur
let genAI;
try {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY n'est pas définie dans les variables d'environnement");
  }
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  console.log("✅ Gemini AI initialisé avec succès\n");
} catch (error) {
  console.error("❌ Erreur lors de l'initialisation de Gemini AI:", error.message);
  console.error("⚠️  L'endpoint /ai-generate ne fonctionnera pas\n");
}

// Routes CRUD standards
router.post("/", eventController.createEvent);
router.get("/", eventController.getAllEvents);
router.get("/:id", eventController.getEventById);
router.put("/:id", eventController.updateEvent);
router.delete("/:id", eventController.deleteEvent);
router.get("/count/total", eventController.countEvents);

// ==========================================
// ROUTE: Générer un événement avec l'IA
// ==========================================
router.post('/ai-generate', async (req, res) => {
  try {
    // Vérifier que Gemini AI est initialisé
    if (!genAI) {
      return res.status(503).json({ 
        error: 'Service IA non disponible',
        details: 'GEMINI_API_KEY non configurée. Vérifiez votre fichier .env'
      });
    }

    const { prompt, userLocation, organizerName } = req.body;

    // Validation du prompt
    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Le prompt est requis et ne peut pas être vide' 
      });
    }

    if (prompt.length > 2000) {
      return res.status(400).json({ 
        error: 'Le prompt est trop long (max 2000 caractères)' 
      });
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🤖 GÉNÉRATION IA DÉMARRÉE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📝 Prompt: ${prompt.substring(0, 100)}...`);
    console.log(`📍 Lieu: ${userLocation || 'Non spécifié'}`);
    console.log(`👤 Organisateur: ${organizerName || 'Non spécifié'}`);

    // Initialiser le modèle Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Créer le prompt structuré pour l'IA
    const structuredPrompt = `
Tu es un assistant IA expert en organisation d'événements professionnels, conférences, workshops et networking.

Contexte utilisateur:
- Localisation: ${userLocation || 'Non spécifiée'}
- Organisation: ${organizerName || 'Non spécifié'}

Description de l'événement par l'utilisateur:
"${prompt}"

Génère un événement complet et professionnel au format JSON suivant. Utilise les informations fournies par l'utilisateur et complète intelligemment les champs manquants avec des suggestions pertinentes et réalistes:

{
  "title": "titre accrocheur et professionnel de l'événement (max 100 caractères)",
  "description": "description détaillée et engageante de l'événement (400-600 mots) qui inclut: objectifs, public cible, programme, intervenants potentiels, format, et bénéfices pour les participants",
  "location": "lieu précis avec adresse ou nom de salle et ville (utilise ${userLocation} si approprié, sinon suggère un lieu pertinent comme Station F Paris, Campus des Startups Lyon, etc.)",
  "date": "date au format YYYY-MM-DD (suggère une date réaliste dans les 1-4 prochains mois)",
  "time": "horaire au format HH:MM - HH:MM (suggère des heures pertinentes selon le type d'événement)",
  "maxAttendees": "nombre de participants (entre 20 et 500, adapté au type d'événement)",
  "category": "UNE SEULE catégorie la plus pertinente parmi: tech, business, startup, ai",
  "price": "prix en format texte (exemples: Gratuit, 25€, 50€, 75€, 100€)",
  "organizer": "${organizerName || 'nom d\'organisation pertinent basé sur le type d\'événement'}",
  "image": "URL d'image Unsplash RÉELLE et pertinente au thème (format: https://images.unsplash.com/photo-XXXXXXXXXX)",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"] (5-6 tags pertinents en français),
  "difficulty": "UNE SEULE valeur parmi: Débutant, Intermédiaire, Avancé, Expert",
  "networking": "UNE SEULE valeur parmi: Faible, Modéré, Élevé, Très élevé"
}

RÈGLES IMPORTANTES:
1. Réponds UNIQUEMENT avec le JSON valide, AUCUN texte avant ou après
2. Tous les champs doivent être remplis avec des valeurs pertinentes
3. La description doit être riche, professionnelle et engageante
4. Les tags doivent être en français et très pertinents au sujet
5. La date doit être réaliste et dans le futur
6. L'URL d'image doit être une vraie URL Unsplash valide
7. Le prix doit être adapté au type et à la qualité de l'événement
`;

    // Appeler l'API Gemini avec gestion d'erreur améliorée
    console.log('🧠 Envoi du prompt à Gemini API...');
    
    let result;
    try {
      result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: structuredPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      });
    } catch (apiError) {
      console.error('❌ Erreur API Gemini:', apiError);
      
      // Erreurs spécifiques
      if (apiError.message?.includes('API_KEY_INVALID') || apiError.status === 400) {
        return res.status(401).json({ 
          error: 'Clé API Gemini invalide',
          details: 'Votre clé API n\'est pas valide. Veuillez la régénérer sur https://aistudio.google.com/app/apikey',
          solution: 'Créez une nouvelle clé API et mettez à jour votre fichier .env, puis redémarrez le serveur'
        });
      }
      
      if (apiError.message?.includes('quota') || apiError.status === 429) {
        return res.status(429).json({ 
          error: 'Quota API dépassé',
          details: 'Vous avez atteint la limite d\'utilisation de l\'API. Réessayez plus tard.'
        });
      }

      throw apiError; // Relancer pour le catch général
    }

    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Réponse reçue de Gemini');

    // Nettoyer la réponse (enlever les backticks markdown si présents)
    let cleanedText = text.trim();
    
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/```\n?/g, '');
    }

    cleanedText = cleanedText.trim();

    // Parser le JSON
    let eventData;
    try {
      eventData = JSON.parse(cleanedText);
      console.log('✅ JSON parsé avec succès');
    } catch (parseError) {
      console.error('❌ Erreur de parsing JSON:', parseError);
      console.error('📄 Texte reçu (premiers 500 caractères):', cleanedText.substring(0, 500));
      return res.status(500).json({ 
        error: 'Erreur lors du parsing de la réponse IA',
        details: 'Le format de réponse n\'est pas du JSON valide. Réessayez.'
      });
    }

    // Valider les données essentielles
    const requiredFields = ['title', 'description', 'date', 'time', 'location'];
    const missingFields = requiredFields.filter(field => !eventData[field]);
    
    if (missingFields.length > 0) {
      console.error('❌ Champs manquants:', missingFields);
      return res.status(500).json({ 
        error: 'Données générées incomplètes',
        missingFields 
      });
    }

    // Valider et nettoyer les données
    eventData = {
      title: eventData.title?.substring(0, 200) || '',
      description: eventData.description || '',
      location: eventData.location || userLocation || 'À définir',
      date: eventData.date || '',
      time: eventData.time || '09:00 - 17:00',
      maxAttendees: eventData.maxAttendees || '100',
      category: ['tech', 'business', 'startup', 'ai'].includes(eventData.category) 
        ? eventData.category 
        : 'tech',
      price: eventData.price || 'Gratuit',
      organizer: eventData.organizer || organizerName || 'Organisation',
      image: eventData.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
      tags: Array.isArray(eventData.tags) ? eventData.tags.slice(0, 8) : [],
      difficulty: ['Débutant', 'Intermédiaire', 'Avancé', 'Expert'].includes(eventData.difficulty)
        ? eventData.difficulty
        : 'Débutant',
      networking: ['Faible', 'Modéré', 'Élevé', 'Très élevé'].includes(eventData.networking)
        ? eventData.networking
        : 'Modéré'
    };

    console.log('✅ Données validées et nettoyées');
    console.log(`📊 Événement généré: "${eventData.title}"`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Retourner les données générées
    res.json(eventData);

  } catch (error) {
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ ERREUR LORS DE LA GÉNÉRATION IA');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    res.status(500).json({ 
      error: 'Erreur serveur lors de la génération',
      details: error.message 
    });
  }
});

export default router;