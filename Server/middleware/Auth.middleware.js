import jwt from 'jsonwebtoken';

const checkAuth = (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) return res.status(401).json({ message: 'No token found, please log in' });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Auth error:', error.message);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

export default checkAuth;