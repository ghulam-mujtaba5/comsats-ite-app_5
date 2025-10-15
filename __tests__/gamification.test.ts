import { checkAndUnlockAchievements } from '../lib/gamification-achievements';

// Mock Supabase client
const mockSupabase = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
};

describe('Gamification System', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkAndUnlockAchievements', () => {
    it('should fetch user stats and achievements', async () => {
      // Mock data
      const userId = 'test-user-id';
      const userStats = {
        posts_count: 5,
        comments_count: 10,
        likes_received: 20,
        resources_uploaded: 2,
        papers_uploaded: 3,
        groups_joined: 1,
        events_attended: 0,
        total_points: 100,
      };
      
      const achievements = [
        {
          id: 'achievement-1',
          title: 'First Post',
          description: 'Create your first post',
          icon: '📝',
          points: 10,
          is_active: true,
          criteria: '{"posts": 1}'
        },
        {
          id: 'achievement-2',
          title: 'Conversation Starter',
          description: 'Create 10 posts',
          icon: '💬',
          points: 50,
          is_active: true,
          criteria: '{"posts": 10}'
        }
      ];
      
      const userAchievements: any[] = [];

      // Mock Supabase responses
      mockSupabase.single
        .mockResolvedValueOnce({ data: userStats, error: null }) // user stats
        .mockResolvedValueOnce({ data: achievements, error: null }) // achievements
        .mockResolvedValueOnce({ data: userAchievements, error: null }) // user achievements
        .mockResolvedValueOnce({ data: { id: 'user-achievement-1' }, error: null }); // insert achievement

      mockSupabase.insert.mockReturnThis();
      mockSupabase.select.mockReturnThis();

      // Call the function
      const result = await checkAndUnlockAchievements(mockSupabase as any, userId);

      // Assertions
      expect(mockSupabase.from).toHaveBeenCalledWith('user_stats');
      expect(mockSupabase.from).toHaveBeenCalledWith('achievements');
      expect(mockSupabase.from).toHaveBeenCalledWith('user_achievements');
      
      // Should unlock the first achievement (5 posts >= 1 post required)
      expect(result).toHaveLength(1);
    });

    it('should not unlock achievements that dont meet criteria', async () => {
      // Mock data
      const userId = 'test-user-id';
      const userStats = {
        posts_count: 5,
        comments_count: 10,
        likes_received: 20,
        resources_uploaded: 2,
        papers_uploaded: 3,
        groups_joined: 1,
        events_attended: 0,
        total_points: 100,
      };
      
      const achievements = [
        {
          id: 'achievement-2',
          title: 'Conversation Starter',
          description: 'Create 10 posts',
          icon: '💬',
          points: 50,
          is_active: true,
          criteria: '{"posts": 10}'
        }
      ];
      
      const userAchievements: any[] = [];

      // Mock Supabase responses
      mockSupabase.single
        .mockResolvedValueOnce({ data: userStats, error: null }) // user stats
        .mockResolvedValueOnce({ data: achievements, error: null }) // achievements
        .mockResolvedValueOnce({ data: userAchievements, error: null }); // user achievements

      // Call the function
      const result = await checkAndUnlockAchievements(mockSupabase as any, userId);

      // Should not unlock any achievements (5 posts < 10 posts required)
      expect(result).toHaveLength(0);
    });

    it('should handle errors gracefully', async () => {
      // Mock error
      mockSupabase.single.mockResolvedValueOnce({ data: null, error: new Error('Database error') });

      const result = await checkAndUnlockAchievements(mockSupabase as any, 'test-user-id');
      
      // Should return empty array on error
      expect(result).toHaveLength(0);
    });
  });
});