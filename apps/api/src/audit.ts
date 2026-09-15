import { prisma } from './prisma';

export const logAudit = async (
  userId: string,
  action: string,
  resource: string,
  resourceId?: string,
  previousValue?: any,
  newValue?: any
) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        resource,
        resourceId,
        previousValue: previousValue ? JSON.stringify(previousValue) : null,
        newValue: newValue ? JSON.stringify(newValue) : null,
      },
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
};
