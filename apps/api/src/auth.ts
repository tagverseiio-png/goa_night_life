import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_goa_key';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

export const requireRole = (roles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.roleId) {
      return res.status(403).json({ error: 'Unauthorized role' });
    }

    try {
      const role = await prisma.role.findUnique({ where: { id: req.user.roleId } });
      if (!role || !roles.includes(role.name)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      next();
    } catch (error) {
      res.status(500).json({ error: 'Internal server error checking roles' });
    }
  };
};

export const generateToken = (userId: string, roleId: string) => {
  return jwt.sign({ userId, roleId }, JWT_SECRET, { expiresIn: '24h' });
};
