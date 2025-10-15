import { POST } from '../app/api/community/posts/route';

// Mock NextRequest
const createMockRequest = (body: any) => ({
  json: jest.fn().mockResolvedValue(body),
});

// Mock Supabase client
const mockSupabase = {
  auth: {
    getUser: jest.fn().mockResolvedValue({
      data: {
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
        },
      },
      error: null,
    }),
  },
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
};

// Mock createSupabaseClient
jest.mock('@/lib/supabase-utils', () => ({
  createSupabaseClient: jest.fn().mockResolvedValue(mockSupabase),
  extractQueryParams: jest.fn().mockReturnValue({}),
  transformPostRecord: jest.fn().mockImplementation((post) => post),
}));

// Mock checkAndUnlockAchievements
jest.mock('@/lib/gamification-achievements', () => ({
  checkAndUnlockAchievements: jest.fn().mockResolvedValue([]),
}));

describe('Community Posts Gamification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update user stats when creating a post', async () => {
    // Mock data
    const mockPost = {
      id: 'post-1',
      user_id: 'test-user-id',
      content: 'Test post content',
      type: 'general',
      media: [],
      location: null,
      feeling: null,
      tagged_users: [],
      visibility: 'public',
      campus_id: null,
      department_id: null,
      batch: null,
      likes_count: 0,
      comments_count: 0,
      shares_count: 0,
      views_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const mockUserStats = {
      posts_count: 5,
      total_points: 100,
    };

    // Mock Supabase responses
    mockSupabase.auth.getUser.mockResolvedValueOnce({
      data: {
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
        },
      },
      error: null,
    });

    mockSupabase.single
      .mockResolvedValueOnce({ data: null, error: null }) // user profile
      .mockResolvedValueOnce({ data: mockPost, error: null }) // insert post
      .mockResolvedValueOnce({ data: mockUserStats, error: null }); // user stats

    mockSupabase.update.mockReturnThis();
    mockSupabase.insert.mockReturnThis();
    mockSupabase.select.mockReturnThis();

    // Create mock request
    const request = createMockRequest({
      content: 'Test post content',
    });

    // Call the POST function
    const response = await POST(request as any);

    // Assertions
    expect(response.status).toBe(200);
    
    // Check that user stats were updated
    expect(mockSupabase.from).toHaveBeenCalledWith('user_stats');
    expect(mockSupabase.update).toHaveBeenCalledWith({
      posts_count: 6, // 5 + 1
      total_points: 115, // 100 + 15
    });
  });
});