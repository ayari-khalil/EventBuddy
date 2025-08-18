import  Match from "../models/Match.js";

export const createMatch = async (data) => {
  const match = new Match(data);
  return await match.save();
};

export const getAllMatches = async () => {
  return await Match.find().populate("eventId");
};

export const getMatchById = async (id) => {
  return await Match.findById(id).populate("eventId");
};

export const updateMatch = async (id, data) => {
  return await Match.findByIdAndUpdate(id, data, { new: true });
};

export const deleteMatch = async (id) => {
  return await Match.findByIdAndDelete(id);
};

