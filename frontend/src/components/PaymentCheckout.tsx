import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CreditCard, Lock, CheckCircle, ArrowLeft, AlertCircle,
  Building, Mail, User, Calendar, Shield, Zap, Info
} from 'lucide-react';

interface PaymentData {
  eventId: string;
  eventTitle: string;
  ticketType: string;
  price: number;
  attendeeName: string;
  attendeeEmail: string;
  bookingData: any;
}

const PaymentCheckout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const paymentData: PaymentData = location.state;

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState('');

  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    saveCard: false
  });

  // Validation du numéro de carte
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Validation de la date d'expiration
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  // Détection du type de carte
  const getCardType = (number: string) => {
    const firstDigit = number.charAt(0);
    if (firstDigit === '4') return 'visa';
    if (firstDigit === '5') return 'mastercard';
    if (firstDigit === '3') return 'amex';
    return 'unknown';
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardData({ ...cardData, cardNumber: formatted });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setCardData({ ...cardData, expiryDate: formatted });
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/gi, '').slice(0, 4);
    setCardData({ ...cardData, cvv: value });
  };

  const processPayment = async () => {
    console.log("🚀 PROCESSUS DE PAIEMENT DÉMARRÉ");
    console.log("État cardData:", cardData);
    console.log("État paymentData:", paymentData);
    
    setError('');
    
    // Vérifier que les champs de carte sont remplis
    const cardNumberClean = cardData.cardNumber.replace(/\s/g, '');
    
    if (!cardData.cardNumber || cardNumberClean.length < 13) {
      console.error("❌ Numéro de carte invalide:", cardData.cardNumber);
      setError('Veuillez entrer un numéro de carte valide (ex: 4242 4242 4242 4242)');
      return;
    }

    if (!cardData.cardName || cardData.cardName.length < 3) {
      console.error("❌ Nom sur carte invalide:", cardData.cardName);
      setError('Veuillez entrer le nom sur la carte (minimum 3 caractères)');
      return;
    }

    if (!cardData.expiryDate || cardData.expiryDate.length < 5) {
      console.error("❌ Date expiration invalide:", cardData.expiryDate);
      setError('Veuillez entrer la date d\'expiration (MM/AA)');
      return;
    }

    if (!cardData.cvv || cardData.cvv.length < 3) {
      console.error("❌ CVV invalide:", cardData.cvv);
      setError('Veuillez entrer le CVV (3 ou 4 chiffres)');
      return;
    }

    console.log("✅ Tous les champs de carte sont remplis");

    setIsProcessing(true);

    try {
      console.log("=== DÉBUT DU TRAITEMENT PAIEMENT ===");
      
      // Mapper les numéros de carte test vers les Payment Method IDs Stripe
      console.log("Numéro de carte nettoyé:", cardNumberClean);
      
      let paymentMethodId = 'pm_card_visa'; // Par défaut
      
      // Détection du type de carte basée sur le numéro
      if (cardNumberClean === '4242424242424242') {
        paymentMethodId = 'pm_card_visa';
        console.log("✅ Carte détectée: Visa Success");
      } else if (cardNumberClean === '5555555555554444') {
        paymentMethodId = 'pm_card_mastercard';
        console.log("✅ Carte détectée: Mastercard Success");
      } else if (cardNumberClean.startsWith('378282')) {
        paymentMethodId = 'pm_card_amex';
        console.log("✅ Carte détectée: Amex Success");
      } else if (cardNumberClean === '4000000000000002') {
        paymentMethodId = 'pm_card_chargeDeclined';
        console.log("⚠️ Carte détectée: Declined (pour test)");
      } else if (cardNumberClean === '4000000000009995') {
        paymentMethodId = 'pm_card_chargeDeclinedInsufficientFunds';
        console.log("⚠️ Carte détectée: Insufficient Funds (pour test)");
      } else {
        // Pour toute autre carte, on utilise Visa par défaut
        paymentMethodId = 'pm_card_visa';
        console.log("⚠️ Carte inconnue, utilisation de Visa par défaut");
      }

      console.log("✅ PaymentMethodId sélectionné:", paymentMethodId);

      // Construire le payload avec toutes les données nécessaires
      const payload = {
        paymentMethodId: paymentMethodId,
        amount: Math.round(paymentData.price * 100), // Montant en centimes
        currency: 'eur',
        eventId: paymentData.eventId,
        attendeeName: paymentData.attendeeName,
        attendeeEmail: paymentData.attendeeEmail,
        ticketType: paymentData.ticketType,
        bookingData: {
          ...paymentData.bookingData,
          cardName: cardData.cardName,
          saveCard: cardData.saveCard
        }
      };

      console.log("📤 Payload complet à envoyer:");
      console.log(JSON.stringify(payload, null, 2));

      // Envoyer la requête de paiement au backend
      console.log("🌐 Envoi de la requête au backend...");
      
      const response = await fetch('http://localhost:5000/api/payment/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      console.log("📥 Réponse du serveur (status " + response.status + "):");
      console.log(data);

      if (!response.ok) {
        console.error("❌ Erreur serveur:", data);
        throw new Error(data.error || data.details || 'Erreur lors du paiement');
      }

      // Vérifier si le paiement nécessite une authentification
      if (data.requires_action) {
        console.warn("⚠️ Authentification 3D Secure requise");
        setError('Authentification 3D Secure requise. Veuillez réessayer.');
        return;
      }

      // Paiement réussi
      console.log("✅ ✅ ✅ PAIEMENT RÉUSSI ! ✅ ✅ ✅");
      console.log("Transaction ID:", data.transactionId);
      setPaymentSuccess(true);

      // Attendre 2 secondes avant de procéder à la réservation
      setTimeout(() => {
        console.log("🔄 Redirection vers la confirmation de réservation...");
        navigate(`/events/${paymentData.eventId}/booking`, {
          state: {
            paymentCompleted: true,
            transactionId: data.transactionId,
            bookingData: {
              ...paymentData.bookingData,
              attendeeName: paymentData.attendeeName,
              attendeeEmail: paymentData.attendeeEmail
            },
            ticketType: paymentData.ticketType
          }
        });
      }, 2000);

    } catch (error: any) {
      console.error('❌ ❌ ❌ ERREUR DE PAIEMENT ❌ ❌ ❌');
      console.error('Détails:', error);
      setError(error.message || 'Erreur lors du paiement. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
      console.log("🏁 Fin du processus de paiement");
    }
  };

  if (!paymentData) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Données de paiement manquantes</h2>
          <button
            onClick={() => navigate('/events')}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 mt-4"
          >
            Retour aux événements
          </button>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 px-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-green-500/20 to-blue-500/20 backdrop-blur-xl border border-green-500/30 rounded-3xl p-8 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Paiement réussi !
          </h2>
          
          <p className="text-gray-300 mb-6">
            Votre paiement de <span className="text-white font-bold">€{paymentData.price}</span> a été traité avec succès.
          </p>

          <div className="text-sm text-gray-400">
            Finalisation de votre réservation...
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 min-h-screen"
    >
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Paiement sécurisé</h1>
                  <p className="text-gray-400 text-sm">Complétez votre réservation</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Lock className="w-4 h-4 text-green-400" />
                <span>Connexion sécurisée SSL 256-bit</span>
              </div>
            </div>

            {/* Card Information */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <CreditCard className="w-6 h-6 text-blue-400 mr-2" />
                Informations de carte
              </h2>

              {/* Test Cards Info */}
              <div className="mb-4 bg-blue-500/10 border border-blue-500/30 rounded-xl p-3">
                <p className="text-blue-300 text-xs font-medium mb-2">🧪 Mode Test - Cartes de test disponibles:</p>
                <div className="text-xs text-gray-300 space-y-1">
                  <div>✅ Succès: <code className="bg-black/30 px-2 py-0.5 rounded">4242 4242 4242 4242</code></div>
                  <div>❌ Déclinée: <code className="bg-black/30 px-2 py-0.5 rounded">4000 0000 0000 0002</code></div>
                  <div>💳 Fonds insuffisants: <code className="bg-black/30 px-2 py-0.5 rounded">4000 0000 0000 9995</code></div>
                  <div className="text-gray-400 mt-1">Date: n'importe quelle date future | CVV: 123</div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Card Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Numéro de carte *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardData.cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="4242 4242 4242 4242"
                      maxLength={19}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
                    />
                    <div className="absolute right-3 top-3">
                      {getCardType(cardData.cardNumber) === 'visa' && (
                        <div className="text-blue-500 font-bold text-sm">VISA</div>
                      )}
                      {getCardType(cardData.cardNumber) === 'mastercard' && (
                        <div className="text-red-500 font-bold text-sm">MC</div>
                      )}
                      {getCardType(cardData.cardNumber) === 'amex' && (
                        <div className="text-blue-400 font-bold text-sm">AMEX</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nom sur la carte *
                  </label>
                  <input
                    type="text"
                    value={cardData.cardName}
                    onChange={(e) => setCardData({ ...cardData, cardName: e.target.value.toUpperCase() })}
                    placeholder="JEAN DUPONT"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
                  />
                </div>

                {/* Expiry & CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Date d'expiration *
                    </label>
                    <input
                      type="text"
                      value={cardData.expiryDate}
                      onChange={handleExpiryChange}
                      placeholder="12/25"
                      maxLength={5}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                      CVV *
                      <div className="group relative ml-1">
                        <Info className="w-3 h-3 text-gray-400 cursor-help" />
                        <div className="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10">
                          Les 3 chiffres au dos de votre carte
                        </div>
                      </div>
                    </label>
                    <input
                      type="text"
                      value={cardData.cvv}
                      onChange={handleCvvChange}
                      placeholder="123"
                      maxLength={4}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Save Card */}
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cardData.saveCard}
                    onChange={(e) => setCardData({ ...cardData, saveCard: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-600 text-blue-500 bg-transparent focus:ring-blue-500/20"
                  />
                  <span className="text-gray-300 text-sm">
                    Enregistrer cette carte pour mes prochains achats
                  </span>
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center space-x-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <p className="text-red-300 text-sm">{error}</p>
                </motion.div>
              )}
            </div>

            {/* Security Info */}
            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-2xl p-4">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-300">
                  <p className="font-medium text-white mb-1">Paiement 100% sécurisé</p>
                  <p>
                    Vos informations bancaires sont cryptées et ne sont jamais stockées sur nos serveurs.
                    Nous utilisons Stripe pour garantir la sécurité de vos transactions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-4">Récapitulatif</h2>

              <div className="space-y-4">
                {/* Event Info */}
                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="text-white font-medium mb-2">{paymentData.eventTitle}</h3>
                  <div className="text-sm text-gray-400 space-y-1">
                    <div className="flex items-center">
                      <User className="w-3 h-3 mr-2" />
                      {paymentData.attendeeName}
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-3 h-3 mr-2" />
                      {paymentData.attendeeEmail}
                    </div>
                  </div>
                </div>

                {/* Ticket Type */}
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Type de billet:</span>
                    <span className="text-white font-medium">{paymentData.ticketType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Prix:</span>
                    <span className="text-white font-medium">€{paymentData.price}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-4 border border-blue-500/30">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold text-lg">Total à payer:</span>
                    <span className="text-green-400 font-bold text-2xl">€{paymentData.price}</span>
                  </div>
                </div>

                {/* Payment Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={processPayment}
                  disabled={isProcessing}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Traitement en cours...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      <span>Payer €{paymentData.price}</span>
                    </>
                  )}
                </motion.button>

                <p className="text-xs text-gray-500 text-center">
                  En cliquant sur "Payer", vous acceptez nos conditions générales
                </p>
              </div>
            </div>

            {/* Accepted Cards */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
              <p className="text-gray-400 text-sm mb-3 text-center">Cartes acceptées</p>
              <div className="flex items-center justify-center space-x-4">
                <div className="bg-white/10 rounded-lg px-3 py-2">
                  <span className="text-blue-400 font-bold text-sm">VISA</span>
                </div>
                <div className="bg-white/10 rounded-lg px-3 py-2">
                  <span className="text-red-400 font-bold text-sm">MC</span>
                </div>
                <div className="bg-white/10 rounded-lg px-3 py-2">
                  <span className="text-blue-300 font-bold text-sm">AMEX</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentCheckout;