# Refactoring Checklist

Use this checklist to track progress during the codebase refactoring.

## Pre-Refactoring (Setup)

- [ ] Read all refactoring documentation
  - [ ] [CODEBASE_REFACTORING_PLAN.md](./CODEBASE_REFACTORING_PLAN.md)
  - [ ] [REFACTORING_IMPLEMENTATION_GUIDE.md](./REFACTORING_IMPLEMENTATION_GUIDE.md)
  - [ ] [Architecture Overview](./architecture/ARCHITECTURE_OVERVIEW.md)
  - [ ] [ADR-001](./architecture/ADR-001-CODEBASE-RESTRUCTURING.md)

- [ ] Team alignment
  - [ ] Review refactoring plan with team
  - [ ] Assign responsibilities
  - [ ] Set timeline expectations
  - [ ] Schedule regular check-ins

- [ ] Backup current state
  - [ ] Create git branch: `refactor/codebase-restructure`
  - [ ] Tag current version: `git tag pre-refactor-v1`
  - [ ] Backup database (if applicable)

## Phase 1: Infrastructure Setup (Week 1)

### Directory Structure
- [ ] Run setup script: `pwsh scripts/setup-refactor-structure.ps1`
- [ ] Verify all directories created
- [ ] Create barrel export files (`index.ts`)
- [ ] Create README files for major directories

### TypeScript Configuration
- [ ] Update `tsconfig.json` with new path aliases
- [ ] Add paths for:
  - [ ] `@/core/*`
  - [ ] `@/infrastructure/*`
  - [ ] `@/features/*`
  - [ ] `@/lib/*`
  - [ ] `@/components/*`
  - [ ] `@/config/*`
- [ ] Restart TypeScript server in VS Code
- [ ] Verify autocomplete works with new aliases

### VS Code Settings
- [ ] Create/update `.vscode/settings.json`
- [ ] Add path intellisense mappings
- [ ] Configure import module specifier
- [ ] Add recommended extensions list

### Verification
- [ ] Run `pnpm build` - should succeed
- [ ] Run `pnpm lint` - should pass
- [ ] Run `pnpm type-check` - should pass
- [ ] Commit changes: `chore(setup): create refactored directory structure`

## Phase 2: Core Layer Migration (Week 2-3)

### Domain Models

#### User Domain
- [ ] Create `src/core/domain/user/user.types.ts`
- [ ] Create `src/core/domain/user/user.schema.ts` (Zod)
- [ ] Create `src/core/domain/user/index.ts`
- [ ] Write tests for domain logic
- [ ] Commit: `feat(core): add user domain model`

#### Timetable Domain
- [ ] Create `src/core/domain/timetable/timetable.types.ts`
- [ ] Create `src/core/domain/timetable/timetable.schema.ts`
- [ ] Create `src/core/domain/timetable/index.ts`
- [ ] Write tests
- [ ] Commit: `feat(core): add timetable domain model`

#### Community Domain
- [ ] Create `src/core/domain/community/community.types.ts`
- [ ] Create `src/core/domain/community/community.schema.ts`
- [ ] Create `src/core/domain/community/index.ts`
- [ ] Write tests
- [ ] Commit: `feat(core): add community domain model`

#### Faculty Domain
- [ ] Create `src/core/domain/faculty/faculty.types.ts`
- [ ] Create `src/core/domain/faculty/faculty.schema.ts`
- [ ] Create `src/core/domain/faculty/index.ts`
- [ ] Write tests
- [ ] Commit: `feat(core): add faculty domain model`

### Use Cases

#### Auth Use Cases
- [ ] Extract login logic → `src/core/use-cases/auth/login.use-case.ts`
- [ ] Extract register logic → `src/core/use-cases/auth/register.use-case.ts`
- [ ] Extract logout logic → `src/core/use-cases/auth/logout.use-case.ts`
- [ ] Write tests for each use case
- [ ] Commit: `feat(core): add auth use cases`

#### Admin Use Cases
- [ ] Extract admin logic → `src/core/use-cases/admin/`
- [ ] Write tests
- [ ] Commit: `feat(core): add admin use cases`

#### Community Use Cases
- [ ] Extract community logic → `src/core/use-cases/community/`
- [ ] Write tests
- [ ] Commit: `feat(core): add community use cases`

### Repository Interfaces
- [ ] Create `src/core/repositories/user.repository.ts`
- [ ] Create `src/core/repositories/timetable.repository.ts`
- [ ] Create `src/core/repositories/community.repository.ts`
- [ ] Create `src/core/repositories/faculty.repository.ts`
- [ ] Create `src/core/repositories/index.ts`
- [ ] Commit: `feat(core): add repository interfaces`

### Verification
- [ ] All domain models have tests
- [ ] All use cases have tests
- [ ] No dependencies on infrastructure
- [ ] Build succeeds
- [ ] Commit: `test(core): add comprehensive core layer tests`

## Phase 3: Infrastructure Layer (Week 3-4)

### Database - MongoDB
- [ ] Move `lib/mongodb.ts` → `src/infrastructure/database/mongodb/connection.ts`
- [ ] Move `lib/mongo.ts` → refactor as needed
- [ ] Create model files in `src/infrastructure/database/mongodb/models/`
- [ ] Update imports across codebase
- [ ] Commit: `refactor(infrastructure): migrate mongodb code`

#### Repository Implementations
- [ ] Implement `MongoDBUserRepository`
- [ ] Implement `MongoDBTimetableRepository`
- [ ] Implement `MongoDBCommunityRepository`
- [ ] Implement `MongoDBFacultyRepository`
- [ ] Write integration tests for repositories
- [ ] Commit: `feat(infrastructure): implement mongodb repositories`

### Database - Supabase
- [ ] Move `lib/supabase.ts` → `src/infrastructure/database/supabase/client.ts`
- [ ] Move `lib/supabase-admin.ts` → `src/infrastructure/database/supabase/admin.ts`
- [ ] Move `lib/supabase-utils.ts` → `src/infrastructure/database/supabase/utils.ts`
- [ ] Create `src/infrastructure/database/supabase/auth.ts`
- [ ] Update imports
- [ ] Commit: `refactor(infrastructure): migrate supabase code`

### Email Service
- [ ] Move `lib/resend-email.ts` → `src/infrastructure/email/resend/client.ts`
- [ ] Create email templates in `src/infrastructure/email/resend/templates/`
- [ ] Update imports
- [ ] Commit: `refactor(infrastructure): migrate email service`

### Storage
- [ ] Move `lib/media-upload.ts` → `src/infrastructure/storage/media-upload.ts`
- [ ] Update imports
- [ ] Commit: `refactor(infrastructure): migrate storage code`

### Verification
- [ ] All infrastructure code implements core interfaces
- [ ] Integration tests pass
- [ ] No direct infrastructure imports in core
- [ ] Build succeeds
- [ ] Commit: `test(infrastructure): add integration tests`

## Phase 4: Feature Modules (Week 4-6)

### Auth Feature
- [ ] Create feature structure: `src/features/auth/`
- [ ] Move auth components → `src/features/auth/components/`
- [ ] Move auth hooks → `src/features/auth/hooks/`
- [ ] Move auth utilities → `src/features/auth/utils/`
- [ ] Create `src/features/auth/types/`
- [ ] Create public API: `src/features/auth/index.ts`
- [ ] Update imports across codebase
- [ ] Write feature tests
- [ ] Commit: `feat(auth): create auth feature module`

### Admin Feature
- [ ] Create feature structure: `src/features/admin/`
- [ ] Migrate admin analytics → `src/features/admin/analytics/`
- [ ] Migrate admin dashboard → `src/features/admin/dashboard/`
- [ ] Move components, hooks, utilities
- [ ] Create public API
- [ ] Update imports
- [ ] Write tests
- [ ] Commit: `feat(admin): create admin feature module`

### Community Feature
- [ ] Create feature structure: `src/features/community/`
- [ ] Move community components
- [ ] Move community hooks
- [ ] Move community utilities
- [ ] Create public API
- [ ] Update imports
- [ ] Write tests
- [ ] Commit: `feat(community): create community feature module`

### Timetable Feature
- [ ] Create feature structure: `src/features/timetable/`
- [ ] Move timetable components
- [ ] Move timetable hooks
- [ ] Move timetable utilities
- [ ] Create public API
- [ ] Update imports
- [ ] Write tests
- [ ] Commit: `feat(timetable): create timetable feature module`

### Other Features
- [ ] Faculty feature
- [ ] Gamification feature
- [ ] GPA Calculator feature
- [ ] Student Portal feature
- [ ] Resources feature
- [ ] Past Papers feature

### Verification
- [ ] Each feature is self-contained
- [ ] Features export only public API
- [ ] No direct cross-feature dependencies (except public API)
- [ ] Tests pass
- [ ] Build succeeds

## Phase 5: Shared Libraries (Week 6-7)

### Utilities
- [ ] Move `lib/utils.ts` → `src/lib/utils/common.utils.ts`
- [ ] Extract date utilities → `src/lib/utils/date.utils.ts`
- [ ] Extract string utilities → `src/lib/utils/string.utils.ts`
- [ ] Extract validation utilities → `src/lib/utils/validation.utils.ts`
- [ ] Create barrel export: `src/lib/utils/index.ts`
- [ ] Update imports
- [ ] Write tests
- [ ] Commit: `refactor(lib): extract utility functions`

### Helpers
- [ ] Move `lib/error-handler.ts` → `src/lib/helpers/error-handler.ts`
- [ ] Move `lib/retry-utils.ts` → `src/lib/helpers/retry.helper.ts`
- [ ] Move `lib/notification-helpers.ts` → `src/lib/helpers/notification.helper.ts`
- [ ] Create barrel export
- [ ] Update imports
- [ ] Commit: `refactor(lib): organize helper functions`

### Constants
- [ ] Extract app constants → `src/lib/constants/app.constants.ts`
- [ ] Extract route constants → `src/lib/constants/routes.constants.ts`
- [ ] Extract validation constants → `src/lib/constants/validation.constants.ts`
- [ ] Move `lib/contribution-constants.ts` → `src/lib/constants/contribution.constants.ts`
- [ ] Create barrel export
- [ ] Update imports
- [ ] Commit: `refactor(lib): organize constants`

### Types
- [ ] Extract common types → `src/lib/types/common.types.ts`
- [ ] Extract API types → `src/lib/types/api.types.ts`
- [ ] Create barrel export
- [ ] Update imports
- [ ] Commit: `refactor(lib): organize shared types`

### Configuration
- [ ] Move `lib/seo-config.ts` → `src/config/seo.config.ts`
- [ ] Create `src/config/app.config.ts`
- [ ] Create `src/config/database.config.ts`
- [ ] Create `src/config/email.config.ts`
- [ ] Create barrel export: `src/config/index.ts`
- [ ] Update imports
- [ ] Commit: `refactor(config): organize configuration files`

### Verification
- [ ] All utilities have tests
- [ ] No circular dependencies
- [ ] Imports use new aliases
- [ ] Build succeeds

## Phase 6: Component Reorganization (Week 7-8)

### UI Components
- [ ] Verify all shadcn/ui components in `components/ui/`
- [ ] Add barrel export: `components/ui/index.ts`
- [ ] Update imports to use barrel
- [ ] Commit: `refactor(components): organize UI components`

### Layout Components
- [ ] Extract header components → `components/layout/header/`
- [ ] Extract footer components → `components/layout/footer/`
- [ ] Extract sidebar components → `components/layout/sidebar/`
- [ ] Create barrel exports
- [ ] Update imports
- [ ] Commit: `refactor(components): organize layout components`

### Common Components
- [ ] Move shared components → `components/common/`
- [ ] Create loading spinner component
- [ ] Create error boundary component
- [ ] Create empty state component
- [ ] Create barrel export
- [ ] Commit: `refactor(components): organize common components`

### Providers
- [ ] Move `components/theme-provider.tsx` → `components/providers/`
- [ ] Create auth provider
- [ ] Create other context providers
- [ ] Create barrel export
- [ ] Update imports
- [ ] Commit: `refactor(components): organize providers`

### Verification
- [ ] All components render correctly
- [ ] No broken imports
- [ ] Build succeeds
- [ ] Visual regression tests pass (if available)

## Phase 7: Testing Infrastructure (Week 8-9)

### Test Setup
- [ ] Create `tests/setup.ts`
- [ ] Configure test environment
- [ ] Setup mocking utilities
- [ ] Create test fixtures
- [ ] Commit: `test(setup): configure testing infrastructure`

### Unit Tests
- [ ] Write tests for core domain models
- [ ] Write tests for use cases
- [ ] Write tests for utilities
- [ ] Write tests for helpers
- [ ] Achieve >80% coverage for core and lib
- [ ] Commit: `test(unit): add comprehensive unit tests`

### Integration Tests
- [ ] Write tests for API routes
- [ ] Write tests for database operations
- [ ] Write tests for external service integrations
- [ ] Commit: `test(integration): add integration tests`

### E2E Tests
- [ ] Write E2E tests for auth flows
- [ ] Write E2E tests for critical user journeys
- [ ] Setup CI pipeline to run E2E tests
- [ ] Commit: `test(e2e): add end-to-end tests`

### Verification
- [ ] All tests pass
- [ ] Test coverage meets targets (>80% for critical code)
- [ ] CI pipeline runs tests successfully

## Phase 8: Documentation (Week 9)

### API Documentation
- [ ] Document all API endpoints
- [ ] Create API reference guide
- [ ] Add request/response examples
- [ ] Commit: `docs(api): add API documentation`

### Architecture Documentation
- [ ] ✅ Architecture overview (already created)
- [ ] ✅ ADR-001 (already created)
- [ ] Create architecture diagrams
- [ ] Document design decisions
- [ ] Commit: `docs(architecture): complete architecture documentation`

### Developer Guides
- [ ] ✅ Contributing guide (already created)
- [ ] ✅ TypeScript path aliases guide (already created)
- [ ] Create deployment guide
- [ ] Create troubleshooting guide
- [ ] Commit: `docs(guides): add developer guides`

### Feature Documentation
- [ ] Document each major feature
- [ ] Add usage examples
- [ ] Document feature APIs
- [ ] Commit: `docs(features): add feature documentation`

### Update README
- [ ] ✅ Update project structure section (already done)
- [ ] Add links to new documentation
- [ ] Update getting started guide
- [ ] Add badges for build status, test coverage, etc.
- [ ] Commit: `docs(readme): update main README`

## Phase 9: Cleanup & Optimization (Week 9-10)

### Remove Old Code
- [ ] Delete old `lib/` files (after verifying all migrated)
- [ ] Remove unused components
- [ ] Remove unused utilities
- [ ] Clean up commented-out code
- [ ] Commit: `chore(cleanup): remove deprecated code`

### Fix All Imports
- [ ] Search for `@/lib-legacy` imports and update
- [ ] Verify no relative imports across layers
- [ ] Use barrel exports where appropriate
- [ ] Commit: `refactor(imports): standardize import paths`

### Optimize Bundle
- [ ] Run bundle analyzer
- [ ] Identify large dependencies
- [ ] Implement code splitting where needed
- [ ] Optimize import statements
- [ ] Commit: `perf(bundle): optimize bundle size`

### Linting & Formatting
- [ ] Run `pnpm lint:fix`
- [ ] Format all files with Prettier
- [ ] Fix any ESLint warnings
- [ ] Update ESLint rules if needed
- [ ] Commit: `style(lint): fix all linting issues`

### Final Verification
- [ ] Run full test suite: `pnpm test`
- [ ] Run E2E tests: `pnpm test:e2e`
- [ ] Build production: `pnpm build`
- [ ] Test production build locally
- [ ] Check for any console errors
- [ ] Verify all features work as expected

## Post-Refactoring

### Code Review
- [ ] Team code review of refactored codebase
- [ ] Address feedback
- [ ] Make necessary adjustments
- [ ] Get team approval

### Deployment
- [ ] Deploy to staging environment
- [ ] Run smoke tests
- [ ] Monitor for errors
- [ ] Deploy to production (if staging successful)

### Documentation Finalization
- [ ] Update CHANGELOG.md
- [ ] Create migration guide for developers
- [ ] Update onboarding documentation
- [ ] Announce changes to team

### Monitoring
- [ ] Monitor production for issues
- [ ] Check error logs
- [ ] Verify performance metrics
- [ ] Gather feedback from team

### Retrospective
- [ ] Hold team retrospective
- [ ] Document lessons learned
- [ ] Identify improvements for future
- [ ] Update refactoring guide based on experience

## Success Metrics

Track these metrics to measure refactoring success:

- [ ] Test coverage: ____% (Target: >80%)
- [ ] Build time: ____ seconds (Baseline: ____ seconds)
- [ ] Bundle size: ____ MB (Baseline: ____ MB)
- [ ] Number of circular dependencies: ____ (Target: 0)
- [ ] Developer satisfaction score: ____/10 (Target: >8)
- [ ] Time to add new feature: ____ hours (Baseline: ____ hours)
- [ ] Onboarding time for new developers: ____ days (Baseline: ____ days)

---

## Notes

Use this space to track issues, blockers, or important decisions during refactoring:

```
Date: [Date]
Issue: [Description]
Resolution: [How it was resolved]
---
```

---

**Last Updated**: October 13, 2025  
**Status**: Ready to begin  
**Estimated Completion**: [Set target date]
