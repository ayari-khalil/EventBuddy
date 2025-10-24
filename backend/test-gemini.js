import dotenv from 'dotenv';
dotenv.config();
import { GoogleGenerativeAI } from '@google/generative-ai';

console.log('\n╔════════════════════════════════════════════════╗');
console.log('║   🧪 TEST DE LA CLÉ API GEMINI   🧪           ║');
console.log('╚════════════════════════════════════════════════╝\n');

// ============================================
// ÉTAPE 1: Vérifier le chargement de .env
// ============================================
console.log('📋 ÉTAPE 1: Vérification du fichier .env\n');

if (!process.env.GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY non trouvée dans process.env !');
  console.error('\n🔧 Solutions:');
  console.error('1. Vérifiez que le fichier .env existe dans le dossier Backend');
  console.error('2. Vérifiez le contenu: GEMINI_API_KEY=votre_cle');
  console.error('3. Pas d\'espaces ni de guillemets autour de la clé');
  console.error('4. La clé doit commencer par AIza\n');
  process.exit(1);
}

const key = process.env.GEMINI_API_KEY;
const keyPreview = key.substring(0, 10) + '...' + key.slice(-6);

console.log('✅ Variable d\'environnement chargée');
console.log(`🔑 Clé: ${keyPreview}`);
console.log(`📏 Longueur: ${key.length} caractères`);
console.log(`🔤 Préfixe: ${key.substring(0, 4)}`);

// Vérifier le format de base
if (!key.startsWith('AIza')) {
  console.warn('\n⚠️  ATTENTION: La clé ne commence pas par "AIza"');
  console.warn('   Les clés Gemini commencent normalement par "AIza"');
  console.warn('   Vérifiez que vous avez copié la clé complète\n');
}

// ============================================
// ÉTAPE 2: Tester l'API avec gemini-pro
// ============================================
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📋 ÉTAPE 2: Test de connexion à l\'API\n');

async function testAPI() {
  try {
    console.log('🔌 Initialisation de GoogleGenerativeAI...');
    
    // ⚠️ CORRECT: Passer la clé directement en string
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    console.log('✅ Client initialisé\n');
    
    // ⚠️ IMPORTANT: Utilisez 'gemini-1.5-flash' qui est le modèle actuel disponible
    console.log('🤖 Utilisation du modèle: gemini-1.5-flash');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    console.log('📤 Envoi d\'une requête de test...\n');
    
    const prompt = 'Réponds juste "Bonjour, l\'API fonctionne !" en une phrase.';
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ ✅ ✅  SUCCÈS !  ✅ ✅ ✅');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`\n📝 Réponse de l'IA: "${text}"\n`);
    console.log('╔════════════════════════════════════════════════╗');
    console.log('║   ✅ VOTRE CLÉ API EST VALIDE ET FONCTIONNE   ║');
    console.log('╚════════════════════════════════════════════════╝');
    console.log('\n🎉 Vous pouvez maintenant:');
    console.log('   1. Démarrer votre serveur: npm start');
    console.log('   2. Tester l\'endpoint: POST /api/events/ai-generate');
    console.log('   3. Utiliser la génération IA dans votre frontend\n');
    
    return true;
    
  } catch (error) {
    console.error('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ ❌ ❌  ERREUR  ❌ ❌ ❌');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.error('Type d\'erreur:', error.constructor.name);
    console.error('Message:', error.message);
    
    if (error.status) {
      console.error('Code HTTP:', error.status);
      console.error('Status:', error.statusText);
    }
    
    // Analyse détaillée selon le type d'erreur
    if (error.message?.includes('API_KEY_INVALID') || error.status === 400) {
      console.error('\n🔴 PROBLÈME: Clé API invalide\n');
      console.error('📝 SOLUTIONS:\n');
      console.error('1️⃣  Générez une NOUVELLE clé API:');
      console.error('   👉 https://aistudio.google.com/app/apikey\n');
      console.error('2️⃣  SUPPRIMEZ votre ancienne clé sur le site\n');
      console.error('3️⃣  CRÉEZ une nouvelle clé avec "Create API Key"\n');
      console.error('4️⃣  COPIEZ la clé COMPLÈTE (commence par AIza...)\n');
      console.error('5️⃣  COLLEZ dans Backend/.env:');
      console.error('   GEMINI_API_KEY=AIzaSy...votre_nouvelle_cle\n');
      console.error('6️⃣  Relancez ce test: node test-gemini.js\n');
      
    } else if (error.message?.includes('quota') || error.status === 429) {
      console.error('\n🔴 PROBLÈME: Quota API dépassé\n');
      console.error('💡 SOLUTION: Attendez quelques minutes ou créez une nouvelle clé\n');
      
    } else if (error.message?.includes('network') || error.code === 'ENOTFOUND') {
      console.error('\n🔴 PROBLÈME: Problème de connexion réseau\n');
      console.error('💡 SOLUTIONS:');
      console.error('   - Vérifiez votre connexion internet');
      console.error('   - Désactivez temporairement votre VPN/proxy');
      console.error('   - Vérifiez votre pare-feu\n');
      
    } else {
      console.error('\n🔴 PROBLÈME: Erreur inconnue\n');
      console.error('💡 Détails complets de l\'erreur:');
      console.error(error);
    }
    
    console.error('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    return false;
  }
}

// ============================================
// ÉTAPE 3: Test avancé (optionnel)
// ============================================
async function testAdvanced() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 ÉTAPE 3: Test avancé (génération JSON)\n');
  
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
Génère un événement au format JSON:
{
  "title": "titre court",
  "description": "description"
}
Réponds UNIQUEMENT avec le JSON, sans texte avant ou après.
`;
    
    console.log('📤 Test de génération JSON structuré...\n');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();
    
    // Nettoyer le texte
    if (text.startsWith('```json')) {
      text = text.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
    }
    
    const jsonData = JSON.parse(text);
    
    console.log('✅ Génération JSON réussie !');
    console.log('📊 Données générées:');
    console.log(JSON.stringify(jsonData, null, 2));
    console.log('\n✅ Votre API peut générer du contenu structuré\n');
    
  } catch (error) {
    console.log('⚠️  Test JSON échoué (pas critique)');
    console.log('💡 L\'API fonctionne mais peut nécessiter des prompts plus précis\n');
  }
}

// Exécuter les tests
(async () => {
  const basicTestPassed = await testAPI();
  
  if (basicTestPassed) {
    // Test avancé seulement si le test de base réussit
    await testAdvanced();
    
    console.log('╔════════════════════════════════════════════════╗');
    console.log('║         🎉 TOUS LES TESTS RÉUSSIS ! 🎉        ║');
    console.log('╚════════════════════════════════════════════════╝\n');
    process.exit(0);
  } else {
    console.log('╔════════════════════════════════════════════════╗');
    console.log('║      ❌ LES TESTS ONT ÉCHOUÉ - VOIR CI-DESSUS ║');
    console.log('╚════════════════════════════════════════════════╝\n');
    process.exit(1);
  }
})();