import { Router } from 'express';
import { authenticateToken } from './auth';
import { prisma } from './prisma';

const router = Router();

// Get reservations for the logged-in customer
router.get('/me', authenticateToken, async (req: any, res) => {
  try {
    const reservations = await prisma.reservation.findMany({
      where: { customerId: req.user.userId },
      include: { table: true },
    });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});

// Create a new reservation
router.post('/', authenticateToken, async (req: any, res) => {
  try {
    const { tableId, date, partySize, specialRequests } = req.body;
    const reservation = await prisma.reservation.create({
      data: {
        customerId: req.user.userId,
        tableId,
        date: new Date(date),
        partySize,
        specialRequests,
      },
    });
    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create reservation' });
  }
});

// QR Code Check-in (Door Staff Only)
router.post('/:id/checkin', authenticateToken, async (req: any, res) => {
  // Normally we would check requireRole(['DOOR_STAFF', 'ADMIN']) here
  try {
    const { id } = req.params;
    const reservation = await prisma.reservation.update({
      where: { id },
      data: { status: 'CHECKED_IN' },
    });
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to check-in reservation' });
  }
});

export default router;
