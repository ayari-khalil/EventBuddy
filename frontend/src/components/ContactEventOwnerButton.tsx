// components/ContactEventOwnerButton.jsx
import React, { useState } from 'react';
import { MessageCircle, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ContactEventOwnerButton = ({ eventId, eventTitle, ownerId }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleContactOwner = async () => {
    try {
      setLoading(true);

      // Récupérer l'utilisateur actuel
      const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
      if (!storedUser) {
        alert('Please log in to contact the event owner');
        navigate('/login');
        return;
      }

      const currentUser = JSON.parse(storedUser);

      // Vérifier si l'utilisateur n'est pas le propriétaire
      if (currentUser._id === ownerId) {
        alert('You are the owner of this event');
        return;
      }

      // Appel API pour démarrer la conversation
      const response = await fetch(
        `http://localhost:5000/api/direct-messages/start-with-event-owner/${eventId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: currentUser._id
          })
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      console.log('Conversation created:', data);

      // Rediriger vers la page de messages avec la conversation sélectionnée
      navigate('/messages', { 
        state: { 
          selectedConversationId: data.data._id,
          eventInfo: data.eventInfo 
        } 
      });

    } catch (error) {
      console.error('Error contacting event owner:', error);
      alert(error.message || 'Failed to start conversation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleContactOwner}
      disabled={loading}
      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
    >
      {loading ? (
        <>
          <Loader className="w-5 h-5 animate-spin" />
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <MessageCircle className="w-5 h-5" />
          <span>Contact Owner</span>
        </>
      )}
    </button>
  );
};

export default ContactEventOwnerButton;