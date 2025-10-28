// payment.routes.js - VERSION CORRIGÉE
import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Route pour traiter un paiement
router.post('/process', async (req, res) => {
  try {
    const { 
      paymentMethodId, 
      amount, 
      currency, 
      eventId, 
      attendeeName, 
      attendeeEmail,
      ticketType,
      bookingData 
    } = req.body;

    // Log pour déboguer
    console.log('📥 Données reçues:', {
      paymentMethodId,
      amount,
      currency,
      eventId,
      attendeeName,
      attendeeEmail,
      ticketType,
      bookingData
    });

    // Validation des données
    if (!paymentMethodId) {
      console.error('❌ paymentMethodId manquant');
      return res.status(400).json({ error: "paymentMethodId est requis" });
    }

    if (!amount || amount < 50) {
      console.error('❌ Montant invalide:', amount);
      return res.status(400).json({ error: "Le montant minimum est de 0.50€ (50 centimes)" });
    }

    if (!currency) {
      console.error('❌ currency manquante');
      return res.status(400).json({ error: "currency est requise" });
    }

    if (!attendeeEmail) {
      console.error('❌ attendeeEmail manquant');
      return res.status(400).json({ error: "attendeeEmail est requis" });
    }

    console.log('✅ Validation des données OK');

    // Créer le PaymentIntent avec la configuration correcte
    console.log('🔄 Création du PaymentIntent...');
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency.toLowerCase(),
      payment_method: paymentMethodId,
      confirm: true,
      receipt_email: attendeeEmail,
      description: `Réservation ${ticketType || 'Standard'} - ${attendeeName || 'Guest'}`,
      metadata: { 
        eventId: eventId?.toString() || 'unknown',
        attendeeName: attendeeName || 'Guest',
        ticketType: ticketType || 'Standard',
        attendeeEmail: attendeeEmail || 'no-email'
      },
      // SOLUTION: Spécifier uniquement 'card' comme type de paiement
      payment_method_types: ['card'],
      // Pas besoin de return_url car on accepte uniquement les cartes
    });

    console.log('✅ PaymentIntent créé:', paymentIntent.id, 'Status:', paymentIntent.status);

    // Vérifier le statut du paiement
    if (paymentIntent.status === 'succeeded') {
      // Paiement réussi
      console.log('✅ Paiement réussi:', paymentIntent.id);
      
      // Sauvegarder la transaction dans votre DB (optionnel)
      // const transaction = await saveTransaction({ ... });

      return res.status(200).json({
        success: true,
        transactionId: paymentIntent.id,
        paymentIntent: {
          id: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: paymentIntent.status,
          receipt_url: paymentIntent.charges?.data[0]?.receipt_url || null,
          created: paymentIntent.created
        },
        message: 'Paiement effectué avec succès'
      });
    } else if (paymentIntent.status === 'requires_action') {
      // Authentification 3D Secure requise
      return res.status(200).json({
        success: false,
        requires_action: true,
        client_secret: paymentIntent.client_secret,
        message: 'Authentification requise'
      });
    } else {
      // Autre statut (en attente, échec, etc.)
      return res.status(400).json({
        success: false,
        error: 'Paiement non finalisé',
        status: paymentIntent.status
      });
    }

  } catch (err) {
    console.error('❌ Erreur de paiement:', err);

    // Gestion des erreurs Stripe spécifiques
    let errorMessage = 'Erreur lors du traitement du paiement';
    let statusCode = 400;

    if (err.type === 'StripeCardError') {
      // Erreur liée à la carte
      errorMessage = err.message || 'Votre carte a été déclinée';
    } else if (err.type === 'StripeInvalidRequestError') {
      // Requête invalide
      errorMessage = err.message || 'Requête invalide';
    } else if (err.type === 'StripeAPIError') {
      // Erreur API Stripe
      errorMessage = 'Service de paiement temporairement indisponible';
      statusCode = 503;
    } else if (err.type === 'StripeConnectionError') {
      // Erreur de connexion
      errorMessage = 'Erreur de connexion au service de paiement';
      statusCode = 503;
    } else if (err.type === 'StripeAuthenticationError') {
      // Erreur d'authentification (clé API invalide)
      errorMessage = 'Erreur de configuration du paiement';
      statusCode = 500;
    }

    return res.status(statusCode).json({ 
      error: errorMessage,
      details: err.message,
      type: err.type
    });
  }
});

// Route pour obtenir l'historique des paiements
router.get('/history', async (req, res) => {
  try {
    // Si vous avez un système d'authentification
    // const userId = req.user.id;

    // Récupérer les 20 derniers paiements depuis Stripe
    const paymentIntents = await stripe.paymentIntents.list({
      limit: 20,
      // Si vous stockez le userId dans metadata:
      // metadata: { userId: userId }
    });

    res.status(200).json({
      success: true,
      payments: paymentIntents.data.map(payment => ({
        id: payment.id,
        amount: payment.amount / 100, // Convertir en euros
        currency: payment.currency,
        status: payment.status,
        created: new Date(payment.created * 1000),
        email: payment.receipt_email,
        metadata: payment.metadata
      }))
    });

  } catch (error) {
    console.error('Erreur récupération historique:', error);
    res.status(500).json({ 
      error: 'Erreur serveur',
      details: error.message 
    });
  }
});

// Route pour obtenir les détails d'un paiement
router.get('/payment/:paymentIntentId', async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (!paymentIntent) {
      return res.status(404).json({ error: 'Paiement non trouvé' });
    }

    res.status(200).json({
      success: true,
      payment: {
        id: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        created: new Date(paymentIntent.created * 1000),
        receipt_email: paymentIntent.receipt_email,
        receipt_url: paymentIntent.charges?.data[0]?.receipt_url,
        metadata: paymentIntent.metadata
      }
    });

  } catch (error) {
    console.error('Erreur récupération paiement:', error);
    res.status(500).json({ 
      error: 'Erreur serveur',
      details: error.message 
    });
  }
});

// Route pour créer un remboursement
router.post('/refund/:paymentIntentId', async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    const { reason, amount } = req.body;

    // Récupérer le PaymentIntent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (!paymentIntent) {
      return res.status(404).json({ error: 'Paiement non trouvé' });
    }

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ 
        error: 'Ce paiement ne peut pas être remboursé',
        status: paymentIntent.status 
      });
    }

    // Créer le remboursement
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount, // Montant optionnel (remboursement partiel)
      reason: reason || 'requested_by_customer',
      metadata: {
        refunded_at: new Date().toISOString()
      }
    });

    res.status(200).json({
      success: true,
      message: 'Remboursement effectué avec succès',
      refund: {
        id: refund.id,
        amount: refund.amount / 100,
        currency: refund.currency,
        status: refund.status,
        reason: refund.reason
      }
    });

  } catch (error) {
    console.error('Erreur remboursement:', error);
    res.status(500).json({ 
      error: 'Erreur lors du remboursement',
      details: error.message 
    });
  }
});

// Webhook Stripe (pour recevoir les événements en temps réel)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('❌ Erreur webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Gérer les événements
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('✅ PaymentIntent succeeded:', paymentIntent.id);
      // Logique: mettre à jour la réservation, envoyer email, etc.
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('❌ PaymentIntent failed:', failedPayment.id);
      // Logique: notifier l'utilisateur
      break;

    case 'charge.refunded':
      const refundedCharge = event.data.object;
      console.log('💰 Charge refunded:', refundedCharge.id);
      // Logique: annuler la réservation, notifier l'utilisateur
      break;

    default:
      console.log(`ℹ️ Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

export default router;