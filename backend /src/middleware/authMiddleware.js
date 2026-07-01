// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const protectAgentContext = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // Decodes validation signature using your portal key
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secure_enterprise_jwt_secret_key_2026');

      // Bind the validated agent payload context explicitly to the active request cycle
      req.user = { id: decoded.id || decoded.agentId || decoded._id };
      
      return next();
    } catch (error) {
      console.error('❌ Security Context Context Rejection:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized: Token context verification validation collapsed.'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: Missing bearer context authorization token string parameters.'
    });
  }
};

module.exports = { protectAgentContext };