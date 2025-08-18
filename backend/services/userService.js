import User from "../models/User.js";

export const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

export const getUserById = async (id) => {
  return await User.findById(id);
};

export const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const updateUser = async (id, updateData) => {
  return await User.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

export const getAllUsers = async () => {
  return await User.find();
};

export const getUsersWithCommonSkills = async (userId, skills) => {
  return await User.find({
    _id: { $ne: userId },
    skills: { $in: skills }
  });
};

export const getTotalUsers = async () => {
  return await User.countDocuments();
};
