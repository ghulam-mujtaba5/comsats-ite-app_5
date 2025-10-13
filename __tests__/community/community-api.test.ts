import { GET, POST } from '@/app/api/community/posts/route'
import { createSupabaseClient } from '@/lib/supabase-utils'

// Mock Supabase client
jest.mock('@/lib/supabase-utils', () => ({
  createSupabaseClient: jest.fn(),
  extractQueryParams: jest.fn().mockReturnValue({
    limit: 20,
    offset: 0,
    withMeta: false,
    campusId: null,
    departmentId: null,
    batch: null
  }),
  transformPostRecord: jest.fn().mockImplementation((post: unknown) => post)
}))

// Mock NextRequest
const createMockRequest = (url: string = 'http://localhost:3000', method: string = 'GET', body?: unknown) => {
  return {
    url,
    method,
    json: jest.fn().mockResolvedValue(body || {}),
    headers: {
      get: jest.fn()
    }
  }
}

// Mock NextResponse
const mockJsonResponse = jest.fn()
const mockNextResponse = {
  json: mockJsonResponse
}

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn().mockImplementation((data: unknown, options: unknown) => {
      mockJsonResponse(data, options)
      return { json: () => Promise.resolve(data) }
    })
  }
}))

describe('Community API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/community/posts', () => {
    it('should fetch posts successfully', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis()
      }
      
      ;(createSupabaseClient as jest.Mock).mockResolvedValue(mockSupabase)
      mockSupabase.select.mockResolvedValue({
        data: [{ id: '1', content: 'Test post' }],
        error: null
      })
      
      const request = createMockRequest()
      await GET(request as any)
      
      expect(createSupabaseClient).toHaveBeenCalled()
      expect(mockSupabase.from).toHaveBeenCalledWith('community_posts')
      expect(mockJsonResponse).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ id: '1', content: 'Test post' })
        ]),
        expect.any(Object)
      )
    })

    it('should handle errors gracefully', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockReturnThis()
      }
      
      ;(createSupabaseClient as jest.Mock).mockResolvedValue(mockSupabase)
      mockSupabase.select.mockResolvedValue({
        data: null,
        error: new Error('Database error')
      })
      
      const request = createMockRequest()
      await GET(request as any)
      
      expect(mockJsonResponse).toHaveBeenCalledWith(
        { error: 'Internal server error' },
        expect.objectContaining({ status: 500 })
      )
    })
  })

  describe('POST /api/community/posts', () => {
    it('should create a post successfully', async () => {
      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: { id: 'user123', email: 'test@example.com' } }
          })
        },
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnThis()
      }
      
      ;(createSupabaseClient as jest.Mock).mockResolvedValue(mockSupabase)
      mockSupabase.insert.mockResolvedValue({
        data: { id: 'post123', content: 'New post' },
        error: null
      })
      
      const request = createMockRequest('http://localhost:3000', 'POST', {
        content: 'New post content',
        type: 'general'
      })
      
      await POST(request as any)
      
      expect(createSupabaseClient).toHaveBeenCalled()
      expect(mockSupabase.from).toHaveBeenCalledWith('community_posts')
      expect(mockSupabase.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: 'user123',
          content: 'New post content',
          type: 'general'
        })
      )
      expect(mockJsonResponse).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'post123', content: 'New post' }),
        expect.any(Object)
      )
    })

    it('should reject posts with insufficient content', async () => {
      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: { id: 'user123' } }
          })
        }
      }
      
      ;(createSupabaseClient as jest.Mock).mockResolvedValue(mockSupabase)
      
      const request = createMockRequest('http://localhost:3000', 'POST', {
        content: 'ab', // Less than 3 characters
        type: 'general'
      })
      
      await POST(request as any)
      
      expect(mockJsonResponse).toHaveBeenCalledWith(
        { error: 'Content must be at least 3 characters' },
        expect.objectContaining({ status: 400 })
      )
    })

    it('should reject unauthenticated requests', async () => {
      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: null }
          })
        }
      }
      
      ;(createSupabaseClient as jest.Mock).mockResolvedValue(mockSupabase)
      
      const request = createMockRequest('http://localhost:3000', 'POST', {
        content: 'Test post',
        type: 'general'
      })
      
      await POST(request as any)
      
      expect(mockJsonResponse).toHaveBeenCalledWith(
        { error: 'Unauthorized' },
        expect.objectContaining({ status: 401 })
      )
    })
  })
})