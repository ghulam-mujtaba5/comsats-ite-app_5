# Deployment Guide for Vercel Free Tier

This guide provides instructions for deploying the CampusAxis application on Vercel's free tier while optimizing resource usage to stay within limits.

## Resource Usage Optimization

The following optimizations have been implemented to minimize resource consumption:

### 1. ISR (Incremental Static Regeneration)
- Faculty profile pages: 1 hour cache (`revalidate = 3600`)
- Faculty listing page: 30 minutes cache (`revalidate = 1800`)
- Home page: 1 hour cache (`revalidate = 3600`)

### 2. API Route Caching
- Campus API: 1 hour cache with 30-minute stale-while-revalidate
- Department API: 1 hour cache with 30-minute stale-while-revalidate
- Faculty API: 1 hour cache with 30-minute stale-while-revalidate
- Faculty stats API: 5 minutes cache with 2.5-minute stale-while-revalidate
- Past papers API: 30 minutes cache with 15-minute stale-while-revalidate
- News API: 30 minutes cache with 15-minute stale-while-revalidate
- Resources API: 1 hour cache with 30-minute stale-while-revalidate
- Community posts API: 5 minutes cache with 2.5-minute stale-while-revalidate

### 3. Database Query Optimizations
- Select only necessary fields instead of using `*`
- Added indexes to frequently queried columns
- Use count queries instead of fetching all data when only counts are needed
- Limit result sets to reduce data transfer

### 4. Image Optimization
- Enabled Next.js image optimization
- Use WebP and AVIF formats when supported
- Set appropriate cache TTL for images

### 5. Supabase Configuration
- Reduced timeouts to prevent long-running queries
- Optimized connection settings for free tier
- Added indexes to improve query performance

## Vercel Free Tier Limits

The application is configured to stay within the following Vercel free tier limits:

- **Serverless Functions**: 100,000 invocations per month
- **Bandwidth**: 100 GB per month
- **Build Minutes**: 6000 per month
- **Edge Config**: 100 KB
- **Edge Functions**: 100,000 invocations per month
- **Edge Middleware**: 100,000 invocations per month

## Deployment Steps

1. Fork the repository to your GitHub account
2. Sign up for a Vercel account at [vercel.com](https://vercel.com)
3. Create a new project and import your forked repository
4. Configure environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
   - `NEXT_PUBLIC_SITE_URL` - Your deployed site URL
5. Deploy the project

## Environment Variables

The following environment variables are required:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SITE_URL=https://your-deployed-site.vercel.app
```

## Monitoring Resource Usage

To monitor your resource usage on Vercel:

1. Go to your project dashboard on Vercel
2. Navigate to the "Analytics" tab
3. Monitor function invocations, bandwidth usage, and build minutes
4. Set up alerts for when you approach limits

## Cost Optimization Tips

1. **Use ISR extensively**: Most pages use ISR to reduce function invocations
2. **Implement proper caching**: API routes have appropriate cache headers
3. **Limit data transfer**: Database queries select only necessary fields
4. **Optimize images**: Next.js image optimization reduces bandwidth usage
5. **Monitor usage**: Regularly check Vercel analytics to ensure you stay within limits

## Supabase Free Tier Considerations

The application is also optimized for Supabase's free tier:

- Database queries are optimized with proper indexing
- Result sets are limited to reduce row reads
- API calls use efficient caching strategies
- Realtime features are rate-limited to stay within limits

## Troubleshooting

If you encounter issues with resource limits:

1. Increase cache durations in API routes
2. Reduce the number of generated static pages
3. Implement more aggressive data filtering
4. Consider upgrading to a paid plan if the application grows beyond free tier limits

## Support

For questions or issues with deployment, please open an issue on the GitHub repository.