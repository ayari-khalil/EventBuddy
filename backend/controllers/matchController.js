import * as matchService from "../services/matchService.js";

export const createMatch = async (req, res) => {
  try {
    const match = await matchService.createMatch(req.body);
    res.status(201).json(match);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllMatches = async (req, res) => {
  try {
    const matches = await matchService.getAllMatches();
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMatchById = async (req, res) => {
  try {
    const match = await matchService.getMatchById(req.params.id);
    if (!match) return res.status(404).json({ message: "Match not found" });
    res.json(match);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateMatch = async (req, res) => {
  try {
    const match = await matchService.updateMatch(req.params.id, req.body);
    if (!match) return res.status(404).json({ message: "Match not found" });
    res.json(match);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteMatch = async (req, res) => {
  try {
    const match = await matchService.deleteMatch(req.params.id);
    if (!match) return res.status(404).json({ message: "Match not found" });
    res.json({ message: "Match deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

