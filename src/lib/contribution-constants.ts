// Contribution point values
export const CONTRIBUTION_POINTS = {
  // Past Papers
  UPLOAD_PAST_PAPER: 50,
  PAST_PAPER_HELPFUL: 10, // Quality recognition from community
  
  // Faculty Reviews
  WRITE_REVIEW: 25,
  REVIEW_HELPFUL: 5,
  QUALITY_REVIEW: 15, // Bonus for reviews >200 chars with good rating
  
  // Community Posts
  CREATE_POST: 15,
  POST_COMMENT: 5, // Generating discussion
  POPULAR_POST: 20, // Bonus for 10+ comments (active discussion)
  
  // Help Desk
  CREATE_TICKET: 10,
  RESOLVE_TICKET: 30,
  HELP_RESPONSE: 20,
  
  // Lost & Found
  REPORT_ITEM: 15,
  ITEM_FOUND: 25,
  
  // Engagement
  PROFILE_COMPLETE: 50,
  DAILY_LOGIN_STREAK: 5,
  WEEKLY_ACTIVE: 25,
  MONTHLY_ACTIVE: 100,
}

// Badge thresholds
export const BADGE_THRESHOLDS = {
  // Contribution badges
  CONTRIBUTOR: 100,
  ACTIVE_CONTRIBUTOR: 500,
  SUPER_CONTRIBUTOR: 1000,
  ELITE_CONTRIBUTOR: 2500,
  LEGENDARY_CONTRIBUTOR: 5000,
  
  // Specific category badges
  PAPER_MASTER: 500, // Past papers contribution
  REVIEW_EXPERT: 300, // Review contribution
  COMMUNITY_LEADER: 400, // Community contribution
  HELPER_HERO: 600, // Help desk contribution
}
