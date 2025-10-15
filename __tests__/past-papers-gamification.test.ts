import { POST } from '../app/api/past-papers/upload/route';

// Mock NextRequest
const createMockFormData = (data: Record<string, any>) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value as any);
  });
  return formData;
};

// Mock Supabase client
const mockSupabaseAdmin = {
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
  storage: {
    from: jest.fn().mockReturnThis(),
    upload: jest.fn().mockResolvedValue({ error: null }),
    getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: 'https://example.com/file.pdf' } }),
  },
};

// Mock createServerClient
jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn().mockReturnValue({
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
  }),
}));

// Mock cookies
jest.mock('next/headers', () => ({
  cookies: jest.fn().mockResolvedValue({
    get: jest.fn(),
    set: jest.fn(),
    remove: jest.fn(),
    toString: jest.fn().mockReturnValue(''),
  }),
}));

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
process.env.SUPABASE_PAST_PAPERS_BUCKET = 'papers';

// Mock checkAndUnlockAchievements
jest.mock('@/lib/gamification-achievements', () => ({
  checkAndUnlockAchievements: jest.fn().mockResolvedValue([]),
}));

// Mock other dependencies
jest.mock('@/lib/rate-limit', () => ({
  rateLimit: jest.fn().mockResolvedValue({ success: true }),
  RateLimitPresets: {
    upload: {},
  },
  getRateLimitHeaders: jest.fn().mockReturnValue({}),
}));

jest.mock('@/lib/validation', () => ({
  pastPaperUploadSchema: {},
  fileUploadSchema: {},
  validateData: jest.fn().mockReturnValue({ success: true, data: {} }),
}));

jest.mock('@/lib/errors', () => ({
  Errors: {
    authRequired: jest.fn().mockReturnValue(new Error('Auth required')),
  },
  formatErrorResponse: jest.fn().mockImplementation((error) => ({ error: error.message })),
  logError: jest.fn(),
}));

jest.mock('@/lib/audit', () => ({
  logAudit: jest.fn(),
  AuditAction: {
    CONTENT_APPROVE: 'content_approve',
  },
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('Past Papers Gamification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update user stats when uploading a paper', async () => {
    // Mock data
    const mockPaperData = {
      title: 'Test Paper',
      course: 'CS101',
      examType: 'Midterm',
      semester: 'Spring',
      year: '2023',
      department: 'Computer Science',
      tags: [],
    };

    const mockPaper = {
      id: 'paper-1',
      title: 'Test Paper',
      course_code: 'CS101',
      exam_type: 'Midterm',
      semester: 'Spring',
      year: '2023',
      department: 'Computer Science',
      file_url: 'https://example.com/file.pdf',
      public_url: 'https://example.com/file.pdf',
      uploaded_by: 'test@example.com',
      user_id: 'test-user-id',
      download_count: 0,
      status: 'pending',
    };

    const mockUserStats = {
      papers_uploaded: 3,
      total_points: 200,
    };

    // Mock Supabase responses
    mockSupabaseAdmin.single
      .mockResolvedValueOnce({ data: mockUserStats, error: null }) // user stats
      .mockResolvedValueOnce({ data: [mockPaper], error: null }); // insert paper

    mockSupabaseAdmin.update.mockReturnThis();
    mockSupabaseAdmin.insert.mockReturnThis();
    mockSupabaseAdmin.select.mockReturnThis();

    // Mock createClient
    const { createClient } = require('@supabase/supabase-js');
    (createClient as jest.Mock).mockReturnValue(mockSupabaseAdmin);

    // Create mock request with form data
    const formData = createMockFormData({
      paperData: JSON.stringify(mockPaperData),
      file: new File(['test'], 'test.pdf', { type: 'application/pdf' }),
    });

    const request = {
      formData: jest.fn().mockResolvedValue(formData),
    };

    // Call the POST function
    const response = await POST(request as any);

    // Assertions
    expect(response.status).toBe(201);
    
    // Check that user stats were updated
    expect(mockSupabaseAdmin.from).toHaveBeenCalledWith('user_stats');
    expect(mockSupabaseAdmin.update).toHaveBeenCalledWith({
      papers_uploaded: 4, // 3 + 1
      total_points: 250, // 200 + 50
    });
  });
});