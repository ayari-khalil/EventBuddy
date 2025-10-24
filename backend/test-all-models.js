import dotenv from 'dotenv';
dotenv.config();
import { GoogleGenerativeAI } from '@google/generative-ai';

console.log('\n╔════════════════════════════════════════════════╗');
console.log('║     🧪 TEST DE TOUS LES MODÈLES GEMINI 🧪     ║');
console.log('╚════════════════════════════════════════════════╝\n');

if (!process.env.GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY non trouvée !');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Liste de tous les modèles Gemini possibles
const modelsToTest = [
  'gemini-pro',
  'gemini-1.5-pro',
  'gemini-1.5-flash',
  'gemini-1.0-pro',
  'gemini-1.5-pro-latest',
  'gemini-1.5-flash-latest',
  'models/gemini-pro',
  'models/gemini-1.5-pro',
  'models/gemini-1.5-flash',
];

async function testModel(modelName) {
  try {
    console.log(`🧪 Test du modèle: ${modelName}`);
    
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent('Dis juste "OK"');
    const response = await result.response;
    const text = response.text();
    
    console.log(`   ✅ FONCTIONNE ! Réponse: "${text.trim()}"\n`);
    return { model: modelName, success: true, response: text.trim() };
    
  } catch (error) {
    if (error.status === 404) {
      console.log(`   ❌ Modèle non trouvé (404)\n`);
    } else if (error.status === 400) {
      console.log(`   ❌ Clé API invalide ou accès refusé (400)\n`);
    } else if (error.status === 403) {
      console.log(`   ❌ Accès interdit - API non activée (403)\n`);
    } else {
      console.log(`   ❌ Erreur: ${error.message}\n`);
    }
    return { model: modelName, success: false, error: error.message };
  }
}

async function testAllModels() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('🔍 Test de tous les modèles disponibles...\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  const results = [];
  
  for (const modelName of modelsToTest) {
    const result = await testModel(modelName);
    results.push(result);
    
    // Pause de 1 seconde entre chaque test pour éviter le rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Résumé
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 RÉSUMÉ DES TESTS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  const successfulModels = results.filter(r => r.success);
  const failedModels = results.filter(r => !r.success);
  
  if (successfulModels.length > 0) {
    console.log('✅ MODÈLES QUI FONCTIONNENT:\n');
    successfulModels.forEach(r => {
      console.log(`   ✓ ${r.model}`);
    });
    console.log('\n');
    
    console.log('╔════════════════════════════════════════════════╗');
    console.log('║           🎉 CLÉ API VALIDE ! 🎉              ║');
    console.log('╚════════════════════════════════════════════════╝\n');
    
    console.log('📝 UTILISEZ CE CODE DANS eventRoutes.js:\n');
    console.log(`const model = genAI.getGenerativeModel({ model: '${successfulModels[0].model}' });\n`);
    
  } else {
    console.log('❌ AUCUN MODÈLE NE FONCTIONNE\n');
    console.log('🔧 SOLUTIONS:\n');
    console.log('1️⃣  Activez l\'API Generative Language:');
    console.log('   👉 https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com\n');
    console.log('2️⃣  Créez une NOUVELLE clé API sur:');
    console.log('   👉 https://aistudio.google.com/app/apikey\n');
    console.log('3️⃣  Assurez-vous que votre projet Google Cloud:');
    console.log('   - A l\'API activée');
    console.log('   - A un compte de facturation configuré (même gratuit)');
    console.log('   - La clé API n\'a pas de restrictions\n');
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔍 ERREURS DÉTAILLÉES:\n');
    failedModels.forEach(r => {
      console.log(`❌ ${r.model}`);
      console.log(`   ${r.error.substring(0, 100)}...\n`);
    });
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

testAllModels();