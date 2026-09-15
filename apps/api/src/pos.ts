import { Router } from 'express';
import { authenticateToken } from './auth';
import { prisma } from './prisma';

const router = Router();

// Get current floor state (Tables)
router.get('/tables', authenticateToken, async (req, res) => {
  try {
    const tables = await prisma.table.findMany();
    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tables' });
  }
});

// Open a new Table Session
router.post('/tables/:id/session', authenticateToken, async (req: any, res) => {
  try {
    const { id: tableId } = req.params;
    const { reservationId } = req.body;

    const session = await prisma.tableSession.create({
      data: {
        tableId,
        reservationId,
        status: 'ACTIVE',
      },
    });

    await prisma.table.update({
      where: { id: tableId },
      data: { status: 'OCCUPIED' },
    });

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ error: 'Failed to open table session' });
  }
});

// Create an order for a session
router.post('/sessions/:id/orders', authenticateToken, async (req: any, res) => {
  try {
    const { id: sessionId } = req.params;
    const { items } = req.body; // Array of { productId, quantity, price }

    const totalAmount = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    const order = await prisma.order.create({
      data: {
        sessionId,
        status: 'CONFIRMED',
        totalAmount,
        finalAmount: totalAmount,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

export default router;
