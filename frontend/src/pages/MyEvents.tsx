import React, { useState,useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Clock, Star, Eye, MessageCircle, UserPlus, Award, TrendingUp, Target, Filter, Plus } from 'lucide-react';

type EventType = {
  id: number | string;
  title: string;
  date: string; // ISO
  time?: string;
  location?: string;
  status?: string;
  attendees?: number;
  myConnections?: number;
  newMatches?: number;
  image?: string;
  organizer?: string;
  myRole?: string;
  applicationDate?: string;
  waitlistPosition?: number;
  talkTitle?: string;
  proposedTalk?: string;
  rating?: number; // 1-5
  achievements?: string[];
  feedback?: string;
  connectionsMode?: number; // number of connections made
  // appliedAs?: string; // e.g. Speaker, Attendee
  appliedAs?: 'Speaker' | 'Attendee' | 'Panelist' | 'Volunteer' | 'Sponsor' | 'Exhibitor'; // etc.
  // ... other fields possible
};

const MyEvents: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "applied">("upcoming");
  const [user, setUser] = useState<any>(null);
  const [events, setEvents] = useState<EventType[]>([]);

  // Charger user et events depuis localStorage/sessionStorage
useEffect(() => {
  const storedUser =
    JSON.parse(localStorage.getItem("user") || "null") ||
    JSON.parse(sessionStorage.getItem("user") || "null");
  setUser(storedUser);
  console.log("Chargement de l'utilisateur depuis localStorage/sessionStorage", storedUser);

  const storedEvents = JSON.parse(localStorage.getItem("events") || "null");
  console.log("Chargement des events depuis localStorage/sessionStorage", storedEvents, storedUser);

  if (storedEvents && Array.isArray(storedEvents)) {
    // Si les events complets sont dans localStorage
    // on filtre seulement ceux que l'utilisateur a bookés
    const userEventIds = storedUser?.events || [];
    const filteredEvents = storedEvents.filter((e: any) =>
      userEventIds.includes(e._id)
    );
    setEvents(filteredEvents);
    console.log("Events filtrés pour l'utilisateur:", filteredEvents);

  } else if (storedUser?.events && Array.isArray(storedUser.events)) {
    // fallback: user.events contient seulement des IDs → fetch API pour récupérer les events
    const fetchUserEvents = async () => {
      try {
        const eventIds = storedUser.events;
        const fetchedEvents = await Promise.all(
          eventIds.map(async (id: string) => {
            console.log("Fetching event details for ID:", id);
            const res = await fetch(`http://localhost:5000/api/events/${id}`);
            return await res.json();
          })
        );
        setEvents(fetchedEvents);
        console.log("Events récupérés depuis le backend:", fetchedEvents);
      } catch (err) {
        console.error("Erreur récupération events by id:", err);
      }
    };
    fetchUserEvents();

  } else {
    setEvents([]); // aucun évènement trouvé
  }
}, []);

  // helper: parse date (returns Date object)
  const parseDate = (d?: string) => {
    if (!d) return null;
    const dt = new Date(d);
    return isNaN(dt.getTime()) ? null : dt;
  };

  const now = useMemo(() => new Date(), []);

  // Filtrage dynamique
  const upcomingEvents = useMemo(() => {
    return events.filter(ev => {
      const evDate = parseDate(ev.date);
      if (!evDate) return false;
      // upcoming: date future AND status not completed
      return evDate >= now && (ev.status ? ev.status !== "completed" : true);
    }).sort((a,b) => parseDate(a.date)!.getTime() - parseDate(b.date)!.getTime());
  }, [events, now]);

  const pastEvents = useMemo(() => {
    return events.filter(ev => {
      const evDate = parseDate(ev.date);
      if (!evDate) return false;
      // past: date in past OR status === completed
      return evDate < now || ev.status === "completed";
    }).sort((a,b) => parseDate(b.date)!.getTime() - parseDate(a.date)!.getTime());
  }, [events, now]);

  const appliedEvents = useMemo(() => {
    // Strategy: if user.events contains applied event ids, filter by those ids,
    // otherwise filter events with status 'pending' or 'waitlist' or that have applicationDate.
    const userEventIds: (number|string)[] = user?.events ?? [];
    if (userEventIds.length > 0) {
      return events.filter(ev => userEventIds.includes(ev.id));
    }
    return events.filter(ev =>
      ["pending", "waitlist"].includes(ev.status || "") || !!ev.applicationDate
    ).sort((a,b) => (parseDate(a.applicationDate || a.date)?.getTime() ?? 0) - (parseDate(b.applicationDate || b.date)?.getTime() ?? 0));
  }, [events, user]);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "confirmed":
        return "from-green-500 to-blue-500";
      case "pending":
        return "from-yellow-500 to-orange-500";
      case "waitlist":
        return "from-purple-500 to-pink-500";
      case "completed":
        return "from-gray-500 to-gray-600";
      default:
        return "from-blue-500 to-purple-500";
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmé";
      case "pending":
        return "En attente";
      case "waitlist":
        return "Liste d'attente";
      case "completed":
        return "Terminé";
      default:
        return status ?? "";
    }
  };

  const renderUpcomingEvents = () => (
    <div className="space-y-6">
      {upcomingEvents.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 * index }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-300"
        >
          <div className="md:flex">
            <div className="md:w-1/3">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 md:h-full object-cover"
              />
            </div>
            
            <div className="md:w-2/3 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`px-3 py-1 bg-gradient-to-r ${getStatusColor(event.status)} rounded-full`}>
                      <span className="text-white text-sm font-medium">{getStatusText(event.status)}</span>
                    </div>
                    {event.myRole === 'Speaker' && (
                      <div className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                        <span className="text-white text-sm font-medium">🎤 Speaker</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
                  {event.talkTitle && (
                    <p className="text-purple-300 font-medium mb-2">"{event.talkTitle}"</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
                <div className="flex items-center text-gray-400">
                  <Calendar className="w-4 h-4 mr-2" />
                  {event.date}
                </div>
                <div className="flex items-center text-gray-400">
                  <Clock className="w-4 h-4 mr-2" />
                  {event.time}
                </div>
                <div className="flex items-center text-gray-400">
                  <MapPin className="w-4 h-4 mr-2" />
                  {event.location}
                </div>
                <div className="flex items-center text-gray-400">
                  <Users className="w-4 h-4 mr-2" />
                  {event.attendees} participants
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <UserPlus className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                  <div className="text-white font-bold">{event.myConnections}</div>
                  <div className="text-gray-400 text-xs">Mes connexions</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <Star className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                  <div className="text-white font-bold">{event.newMatches}</div>
                  <div className="text-gray-400 text-xs">Nouveaux matches</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <Eye className="w-5 h-5 text-green-400 mx-auto mb-1" />
                  <div className="text-white font-bold">Actif</div>
                  <div className="text-gray-400 text-xs">Statut</div>
                </div>
              </div>

              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Voir les détails</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-white/5 text-gray-300 rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Messages</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderPastEvents = () => (
    <div className="space-y-6">
      {pastEvents.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 * index }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-300"
        >
          <div className="md:flex">
            <div className="md:w-1/3">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 md:h-full object-cover opacity-75"
              />
            </div>
            
            <div className="md:w-2/3 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`px-3 py-1 bg-gradient-to-r ${getStatusColor(event.status)} rounded-full`}>
                      <span className="text-white text-sm font-medium">{getStatusText(event.status)}</span>
                    </div>
                    {event.myRole === 'Panelist' && (
                      <div className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                        <span className="text-white text-sm font-medium">🎯 Panelist</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
                  {event.talkTitle && (
                    <p className="text-purple-300 font-medium mb-2">"{event.talkTitle}"</p>
                  )}
                </div>
                
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-400 font-bold">{event.rating}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
                <div className="flex items-center text-gray-400">
                  <Calendar className="w-4 h-4 mr-2" />
                  {event.date}
                </div>
                <div className="flex items-center text-gray-400">
                  <Clock className="w-4 h-4 mr-2" />
                  {event.time}
                </div>
                <div className="flex items-center text-gray-400">
                  <MapPin className="w-4 h-4 mr-2" />
                  {event.location}
                </div>
                <div className="flex items-center text-gray-400">
                  <Users className="w-4 h-4 mr-2" />
                  {event.attendees} participants
                </div>
              </div>

              {/* Achievements */}
              {event.achievements && (
                <div className="mb-4">
                  <h4 className="text-white font-medium mb-2 flex items-center">
                    <Award className="w-4 h-4 text-yellow-400 mr-2" />
                    Accomplissements
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {event.achievements.map((achievement) => (
                      <span
                        key={achievement}
                        className="px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-300 text-sm rounded-full"
                      >
                        🏆 {achievement}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Feedback */}
              {event.feedback && (
                <div className="mb-4 p-4 bg-white/5 rounded-xl">
                  <p className="text-gray-300 italic">"{event.feedback}"</p>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <UserPlus className="w-5 h-5 text-green-400 mx-auto mb-1" />
                  <div className="text-white font-bold">{event.connectionsMode}</div>
                  <div className="text-gray-400 text-xs">Connexions créées</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <TrendingUp className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                  <div className="text-white font-bold">{event.rating}/5</div>
                  <div className="text-gray-400 text-xs">Ma note</div>
                </div>
              </div>

              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-4 py-2 bg-white/5 text-gray-300 rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Voir le résumé</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-white/5 text-gray-300 rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Connexions</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderAppliedEvents = () => (
    <div className="space-y-6">
      {appliedEvents.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 * index }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-300"
        >
          <div className="md:flex">
            <div className="md:w-1/3">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 md:h-full object-cover"
              />
            </div>
            
            <div className="md:w-2/3 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`px-3 py-1 bg-gradient-to-r ${getStatusColor(event.status)} rounded-full`}>
                      <span className="text-white text-sm font-medium">{getStatusText(event.status)}</span>
                    </div>
                    <div className="px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full">
                      <span className="text-white text-sm font-medium">{event.appliedAs}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
                  {event.proposedTalk && (
                    <p className="text-blue-300 font-medium mb-2">Sujet proposé: "{event.proposedTalk}"</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
                <div className="flex items-center text-gray-400">
                  <Calendar className="w-4 h-4 mr-2" />
                  {event.date}
                </div>
                <div className="flex items-center text-gray-400">
                  <Clock className="w-4 h-4 mr-2" />
                  {event.time}
                </div>
                <div className="flex items-center text-gray-400">
                  <MapPin className="w-4 h-4 mr-2" />
                  {event.location}
                </div>
                <div className="flex items-center text-gray-400">
                  <Users className="w-4 h-4 mr-2" />
                  {event.attendees} participants
                </div>
              </div>

              {/* Application Info */}
              <div className="bg-white/5 rounded-xl p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Candidature envoyée:</span>
                    <span className="text-white ml-2">{event.applicationDate}</span>
                  </div>
                  {event.waitlistPosition && (
                    <div>
                      <span className="text-gray-400">Position liste d'attente:</span>
                      <span className="text-purple-300 ml-2 font-bold">#{event.waitlistPosition}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Voir ma candidature</span>
                </motion.button>
                {event.status === 'pending' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-white/5 text-gray-300 rounded-xl hover:bg-white/10 transition-all duration-300"
                  >
                    Modifier
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Mes événements 📅
          </h1>
          <p className="text-gray-400 text-lg">
            Gérez vos participations et suivez vos performances de networking
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 mb-8"
        >
          <div className="flex space-x-2">
            {[
              { id: 'upcoming', label: 'À venir', count: upcomingEvents.length },
              { id: 'past', label: 'Passés', count: pastEvents.length },
              { id: 'applied', label: 'Candidatures', count: appliedEvents.length }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-white/10'
                }`}>
                  {tab.count}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {activeTab === 'upcoming' && renderUpcomingEvents()}
          {activeTab === 'past' && renderPastEvents()}
          {activeTab === 'applied' && renderAppliedEvents()}
        </motion.div>

        {/* Empty State */}
        {((activeTab === 'upcoming' && upcomingEvents.length === 0) ||
          (activeTab === 'past' && pastEvents.length === 0) ||
          (activeTab === 'applied' && appliedEvents.length === 0)) && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-gray-500/20 to-gray-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {activeTab === 'upcoming' && "Aucun événement à venir"}
              {activeTab === 'past' && "Aucun événement passé"}
              {activeTab === 'applied' && "Aucune candidature"}
            </h3>
            <p className="text-gray-400 mb-6">
              {activeTab === 'upcoming' && "Découvrez de nouveaux événements pour étendre votre réseau"}
              {activeTab === 'past' && "Vos événements passés apparaîtront ici"}
              {activeTab === 'applied' && "Vos candidatures en cours apparaîtront ici"}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Découvrir des événements</span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MyEvents;