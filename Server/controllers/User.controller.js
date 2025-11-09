import User from '../models/User.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

export const auth = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (user) {
      const isValidPass = await bcrypt.compare(password, user.password);
      if (isValidPass) {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 7 * 24 * 3600000, sameSite: 'lax' });
        return res.status(200).json({ userId: user._id });
      }

      return res.status(401).json({ message: "Invalid credentials" });
    }

    const encryptedPass = await bcrypt.hash(password, 10);

    const newUser = await User.create({ email, password: encryptedPass });
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 7 * 24 * 3600000, sameSite: "lax" });
    return res.status(201).json({ userId: newUser._id });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createProfile = async (req, res) => {
  try {
    const { name, about, college, phone, email } = req.body;

    if (!name) {
      return res.status(401).json({ message: "Name is required" });
    }

    const skills = JSON.parse(req.body.skills || "[]");
    const achievements = JSON.parse(req.body.achievements || "[]");

    // Get existing user
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ---------- Handle profile image ----------
    const profileFile = req.files?.find(f => f.fieldname === "profile");
    if (profileFile) {
      const uploadedProfile = await uploadToCloudinary(profileFile);
      user.profile = uploadedProfile;
    }

    // ---------- Handle projects ----------
    const projects = [...(user.projects || [])]; // keep old ones
    const newProjects = [];

    // Extract project indexes from req.files
    const projectFiles = req.files?.filter(f => f.fieldname.startsWith("projects[")) || [];

    // Upload project images if provided
    for (const file of projectFiles) {
      const match = file.fieldname.match(/projects\[(\d+)\]/);
      if (!match) continue;
      const index = parseInt(match[1]);

      const uploaded = await uploadToCloudinary(file);
      newProjects.push({ index, imageUrl: uploaded });
    }

    // Parse project data from req.body (it may arrive as JSON or nested fields)
    const parsedProjects = [];
    if (req.body.projects) {
      // If the frontend sent JSON string
      if (typeof req.body.projects === "string") {
        parsedProjects.push(...JSON.parse(req.body.projects));
      } else {
        // If sent as multipart fields
        Object.keys(req.body.projects).forEach(idx => {
          parsedProjects.push(req.body.projects[idx]);
        });
      }
    }

    // Merge projects
    parsedProjects.forEach((proj, i) => {
      const existingImage = newProjects.find(p => p.index === i)?.imageUrl;
      const updatedProject = {
        projectTitle: proj.projectTitle || projects[i]?.projectTitle || "",
        projectLink: proj.projectLink || projects[i]?.projectLink || "",
        projectImage: existingImage || projects[i]?.projectImage || "",
      };

      // If it’s an old project being updated
      if (projects[i]) {
        projects[i] = updatedProject;
      } else {
        // It’s a new project → push to end
        projects.push(updatedProject);
      }
    });

    // ---------- Save updated profile ----------
    user.name = name;
    user.about = about;
    user.college = college;
    user.phone = phone;
    user.email = email;
    user.skills = skills;
    user.achievements = achievements;
    user.projects = projects;

    const updatedUser = await user.save();

    res.status(201).json({
      success: true,
      message: "Profile updated successfully",
      profile: updatedUser,
    });
  } catch (error) {
    console.error("Create Profile Error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating profile",
      error: error.message,
    });
  }
};



export const searchProfile = async (req, res) => {
  try {
    const { name } = req.query;
    const regex = new RegExp(name, 'i');
    const students = await User.find({ name: regex });
    return res.status(200).json({ students, message: "Operations Successful" });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Something went wrong" });
  }
}


export const getProfile = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }


    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      profile: user,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching profile",
      error: error.message,
    });
  }
};


export const logout = async (req, res) => {
  try {
    res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 7 * 24 * 3600000, sameSite: "lax" });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error('Logout error:', error.message);
    return res.status(500).json({ message: 'Something went wrong while logging out' });
  }
}