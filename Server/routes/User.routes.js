import express from 'express';
import { auth, createProfile, getProfile, logout, requestResetPwd, resetPwd, searchProfile } from '../controllers/User.controller.js';
import checkAuth from '../middleware/Auth.middleware.js';
import upload from '../middleware/multer.middleware.js';

const router = express.Router();

router.post('/auth', auth);
router.post('/logout', logout);
router.get('/checkAuth', checkAuth, (req, res)=>{
    res.status(200).json({user: req.user});
});
router.post('/create-profile', upload.any(), checkAuth, createProfile);
router.get("/profile/:id", getProfile);
router.get("/search", searchProfile);
router.post("/request-reset-pwd", requestResetPwd);
router.post("/reset-pwd", resetPwd);

export default router;