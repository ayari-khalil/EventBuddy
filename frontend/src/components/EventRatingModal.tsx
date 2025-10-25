import React, { useState } from 'react';
import { Star, X, Send } from 'lucide-react';

interface EventRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
  onSubmitRating: (eventId: string, rating: number, comment: string) => Promise<void>;
}

const EventRatingModal: React.FC<EventRatingModalProps> = ({
  isOpen,
  onClose,
  eventId,
  eventTitle,
  onSubmitRating,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Veuillez sélectionner une note');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmitRating(eventId, rating, comment);
      
      // Reset form
      setRating(0);
      setComment('');
      onClose();
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Une erreur est survenue lors de la soumission de votre évaluation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl max-w-md w-full border border-white/10 transform transition-all duration-300 scale-100 animate-in fade-in zoom-in">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-white/10">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Évaluer l'événement
            </h3>
            <p className="text-gray-400 text-sm mt-1 line-clamp-1">{eventTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Votre note <span className="text-red-400">*</span>
            </label>
            <div className="flex items-center justify-center space-x-2 py-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-all duration-200 transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`w-10 h-10 transition-all duration-200 ${
                      star <= (hoverRating || rating)
                        ? 'fill-yellow-400 text-yellow-400 drop-shadow-lg'
                        : 'text-gray-600 hover:text-gray-500'
                    }`}
                    style={{
                      filter: star <= (hoverRating || rating) ? 'drop-shadow(0 0 8px rgba(250, 204, 21, 0.5))' : 'none'
                    }}
                  />
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-gray-400 mt-2">
              {rating === 0 && 'Sélectionnez votre note'}
              {rating === 1 && '⭐ Décevant'}
              {rating === 2 && '⭐⭐ Moyen'}
              {rating === 3 && '⭐⭐⭐ Bien'}
              {rating === 4 && '⭐⭐⭐⭐ Très bien'}
              {rating === 5 && '⭐⭐⭐⭐⭐ Excellent'}
            </p>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Commentaire <span className="text-gray-500">(optionnel)</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Partagez votre expérience..."
              rows={4}
              maxLength={500}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 resize-none"
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500">Maximum 500 caractères</p>
              <p className="text-xs text-gray-500">{comment.length}/500</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center space-x-3 p-6 border-t border-white/10">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl transition-all duration-300 border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/25"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Envoi...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Envoyer</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventRatingModal;
