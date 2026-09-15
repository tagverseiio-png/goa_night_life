import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { authenticateToken, generateToken, requireRole, AuthRequest } from './auth';
import { prisma } from './prisma';
import bcrypt from 'bcrypt';

import reservationsRouter from './reservations';
import posRouter from './pos';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use('/api/reservations', reservationsRouter);
app.use('/api', posRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'GOA Core API', version: '1.0.0' });
});

// Authentication
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, roleName = 'CUSTOMER' } = req.body;
    
    // Default to a customer role
    let role = await prisma.role.findUnique({ where: { name: roleName } });
    if (!role) {
      role = await prisma.role.create({ data: { name: roleName, permissions: JSON.stringify([]) } });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        roleId: role.id,
        profile: {
          create: {
            name: name || 'GOA User'
          }
        }
      }
    });

    res.status(201).json({ message: 'User created successfully', userId: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email }, include: { role: true } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = generateToken(user.id, user.roleId);
    res.json({ token, user: { id: user.id, email: user.email, role: user.role.name } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Protected Route Example
app.get('/api/users/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { profile: true, role: true }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

app.listen(port, () => {
  console.log(`[GOA API] Server is running on port ${port}`);
});
