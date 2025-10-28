// ========================================
// Transaction.model.js (Modèle MongoDB)
// ========================================

const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  stripeChargeId: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true,
    default: 'eur'
  },
  status: {
    type: String,
    enum: ['pending', 'succeeded', 'failed', 'refunded'],
    default: 'pending'
  },
  ticketType: {
    type: String,
    required: true
  },
  attendeeName: String,
  attendeeEmail: String,
  bookingData: {
    type: Object
  },
  receiptUrl: String,
  refundId: String,
  refundedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);


// ========================================
// app.js ou server.js (Configuration)
// ========================================

// Ajouter à votre fichier principal



// ========================================
// .env (Variables d'environnement)
// ========================================

/*
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete_stripe
STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_publique_stripe
STRIPE_WEBHOOK_SECRET=whsec_votre_secret_webhook
*/


// ========================================
// Installation des dépendances
// ========================================

/*
npm install stripe express mongoose dotenv

Pour utiliser Stripe:
1. Créez un compte sur https://stripe.com
2. Récupérez vos clés API (test et production)
3. Ajoutez les clés dans votre fichier .env
4. Configurez les webhooks dans le dashboard Stripe
5. Testez avec les numéros de carte de test Stripe:
   - Succès: 4242 4242 4242 4242
   - Décliné: 4000 0000 0000 0002
   - Authentification requise: 4000 0025 0000 3155
*/