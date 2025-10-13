import { render, screen } from '@testing-library/react'
import { EnhancedHero } from '@/components/home/enhanced-hero'
import { EnhancedFeatures } from '@/components/home/enhanced-features'
import { EnhancedNews } from '@/components/home/enhanced-news'
import { EnhancedCommunity } from '@/components/home/enhanced-community'
import { EnhancedFAQ } from '@/components/home/enhanced-faq'
import { EnhancedComingSoon } from '@/components/home/enhanced-coming-soon'
import React from 'react'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null
    }
  }
}))

// Mock fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
    headers: {
      get: () => null
    }
  } as unknown as Response)
) as jest.Mock

describe('Enhanced Components', () => {
  describe('EnhancedHero', () => {
    it('renders without crashing', () => {
      render(<EnhancedHero />)
      expect(screen.getByText(/CampusAxis/i)).toBeInTheDocument()
    })
  })

  describe('EnhancedFeatures', () => {
    it('renders without crashing', () => {
      render(<EnhancedFeatures />)
      expect(screen.getByText(/Academic Success/i)).toBeInTheDocument()
    })
  })

  describe('EnhancedNews', () => {
    it('renders without crashing', () => {
      render(<EnhancedNews />)
      expect(screen.getByText(/Latest News/i)).toBeInTheDocument()
    })
  })

  describe('EnhancedCommunity', () => {
    it('renders without crashing', () => {
      render(<EnhancedCommunity />)
      expect(screen.getByText(/Academic Community/i)).toBeInTheDocument()
    })
  })

  describe('EnhancedFAQ', () => {
    it('renders without crashing', () => {
      render(<EnhancedFAQ />)
      expect(screen.getByText(/Frequently Asked Questions/i)).toBeInTheDocument()
    })
  })

  describe('EnhancedComingSoon', () => {
    it('renders without crashing', () => {
      render(<EnhancedComingSoon />)
      expect(screen.getByText(/Beta Testing Area/i)).toBeInTheDocument()
    })
  })
})