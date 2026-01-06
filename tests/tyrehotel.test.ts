import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchTyres } from '@/app/actions/tyrehotel';
import { auth } from '@/auth';
import { prisma } from '@/prisma/prisma';

// Mock server-only
vi.mock('server-only', () => ({}));

// Mock auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

// Mock prisma
vi.mock('@/prisma/prisma', () => ({
  prisma: {
    tyre: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

describe('tyrehotel actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchTyres', () => {
    it('should return error result if user is not logged in', async () => {
      // Simulate logged out
      vi.mocked(auth).mockResolvedValue(null as any);

      const result = await fetchTyres();
      
      expect(result.success).toBe(false);
      expect(prisma.tyre.findMany).not.toHaveBeenCalled();
    });

    it('should return success result with data if user is logged in', async () => {
      // Simulate logged in
      vi.mocked(auth).mockResolvedValue({ user: { id: '1' } } as any);
      
      // Mock prisma response
      vi.mocked(prisma.tyre.findMany).mockResolvedValue([]);
      vi.mocked(prisma.tyre.count).mockResolvedValue(0);

      const result = await fetchTyres();
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.tyres).toEqual([]);
      }
      expect(prisma.tyre.findMany).toHaveBeenCalled();
    });
  });
});
