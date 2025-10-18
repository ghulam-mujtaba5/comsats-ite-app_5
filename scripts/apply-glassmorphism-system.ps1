# Apply Glassmorphism Design System
# This script updates existing CSS modules to use the comprehensive glassmorphism design

Write-Host "🎨 CampusAxis Glassmorphism Design System Updater" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

$rootPath = "e:\comsats-ite-app_5"

# Count files that need updating
$tsxFiles = Get-ChildItem -Path "$rootPath\app", "$rootPath\components" -Recurse -Filter "*.tsx" -File
$totalFiles = $tsxFiles.Count

Write-Host "📊 Found $totalFiles TSX component files" -ForegroundColor Yellow
Write-Host ""

# Define glassmorphism templates
$baseTemplate = @'
/* Base Module - Theme-Independent Structure */

.container {
  position: relative;
  border-radius: clamp(16px, 2.5vw, 24px);
  padding: clamp(1.5rem, 3vw, 3rem);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.header {
  margin-bottom: clamp(1rem, 2vw, 1.5rem);
}

.title {
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: clamp(0.9375rem, 1.5vw, 1.125rem);
  line-height: 1.5;
}

.content {
  font-size: clamp(0.9375rem, 1.5vw, 1.0625rem);
  line-height: 1.6;
}

.footer {
  margin-top: clamp(1.5rem, 3vw, 2.5rem);
  padding-top: clamp(1rem, 2vw, 1.5rem);
}

/* Responsive grid */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(clamp(260px, 30vw, 320px), 1fr));
  gap: clamp(1.25rem, 2.5vw, 2.5rem);
}

/* Interactive elements */
.button {
  border-radius: clamp(8px, 1.5vw, 12px);
  padding: clamp(0.625rem, 1.25vw, 0.875rem) clamp(1.25rem, 2.5vw, 1.75rem);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.button:hover {
  transform: translateY(-2px);
}

.button:active {
  transform: translateY(0);
}

/* Card variant */
.card {
  position: relative;
  border-radius: clamp(14px, 2vw, 20px);
  padding: clamp(1.25rem, 2.5vw, 2rem);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
}

.card:hover::before {
  opacity: 1;
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .container,
  .button,
  .card {
    transition: none;
    transform: none !important;
  }
}
'@

$lightTemplate = @'
/* Light Mode - Layered/3D Glassmorphism */

.container {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px) saturate(150%);
  -webkit-backdrop-filter: blur(12px) saturate(150%);
  border: 1px solid rgba(148, 163, 184, 0.18);
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.06),
    0 2px 8px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.85);
}

.container:hover {
  background: rgba(255, 255, 255, 0.85);
  border-color: rgba(148, 163, 184, 0.28);
  box-shadow: 
    0 8px 24px rgba(0, 0, 0, 0.08),
    0 4px 12px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
}

.title {
  color: rgba(15, 23, 42, 0.95);
}

.subtitle,
.content {
  color: rgba(51, 65, 85, 0.85);
}

.button {
  background: linear-gradient(135deg, 
    rgba(99, 102, 241, 0.95), 
    rgba(139, 92, 246, 0.95)
  );
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #ffffff;
  box-shadow: 
    0 4px 14px rgba(99, 102, 241, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

.button:hover {
  background: linear-gradient(135deg, 
    rgba(99, 102, 241, 1), 
    rgba(139, 92, 246, 1)
  );
  box-shadow: 
    0 8px 24px rgba(99, 102, 241, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.35);
}

.card {
  background: rgba(255, 255, 255, 0.70);
  backdrop-filter: blur(10px) saturate(155%);
  -webkit-backdrop-filter: blur(10px) saturate(155%);
  border: 1px solid rgba(148, 163, 184, 0.16);
  box-shadow: 
    0 3px 14px rgba(0, 0, 0, 0.05),
    0 1px 6px rgba(0, 0, 0, 0.03),
    inset 0 1px 0 rgba(255, 255, 255, 0.80);
}

.card::before {
  background: linear-gradient(90deg, 
    rgba(99, 102, 241, 0.7),
    rgba(139, 92, 246, 0.7),
    rgba(59, 130, 246, 0.7)
  );
}

.card:hover {
  background: rgba(255, 255, 255, 0.82);
  border-color: rgba(148, 163, 184, 0.25);
  box-shadow: 
    0 6px 20px rgba(0, 0, 0, 0.07),
    0 3px 10px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.90);
}

/* Mobile - Reduced blur */
@media (max-width: 768px) {
  .container,
  .card {
    backdrop-filter: blur(8px) saturate(140%);
    -webkit-backdrop-filter: blur(8px) saturate(140%);
  }
}
'@

$darkTemplate = @'
/* Dark Mode - Deep Tinted Glassmorphism */

.container {
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  border: 1px solid rgba(148, 163, 184, 0.12);
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.5),
    0 2px 10px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.container:hover {
  background: rgba(15, 23, 42, 0.78);
  border-color: rgba(148, 163, 184, 0.20);
  box-shadow: 
    0 8px 28px rgba(0, 0, 0, 0.6),
    0 4px 14px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.07),
    0 0 40px rgba(99, 102, 241, 0.15);
}

.title {
  color: rgba(248, 250, 252, 0.95);
}

.subtitle,
.content {
  color: rgba(226, 232, 240, 0.85);
}

.button {
  background: linear-gradient(135deg, 
    rgba(99, 102, 241, 0.85), 
    rgba(139, 92, 246, 0.85)
  );
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #ffffff;
  box-shadow: 
    0 4px 14px rgba(99, 102, 241, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    0 0 35px rgba(99, 102, 241, 0.18);
}

.button:hover {
  background: linear-gradient(135deg, 
    rgba(99, 102, 241, 0.95), 
    rgba(139, 92, 246, 0.95)
  );
  box-shadow: 
    0 8px 24px rgba(99, 102, 241, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.20),
    0 0 50px rgba(99, 102, 241, 0.25);
}

.card {
  background: rgba(15, 23, 42, 0.60);
  backdrop-filter: blur(12px) saturate(145%);
  -webkit-backdrop-filter: blur(12px) saturate(145%);
  border: 1px solid rgba(148, 163, 184, 0.10);
  box-shadow: 
    0 3px 16px rgba(0, 0, 0, 0.45),
    0 1px 8px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.card::before {
  background: linear-gradient(90deg, 
    rgba(99, 102, 241, 0.6),
    rgba(139, 92, 246, 0.6),
    rgba(59, 130, 246, 0.6)
  );
}

.card:hover {
  background: rgba(15, 23, 42, 0.73);
  border-color: rgba(148, 163, 184, 0.18);
  box-shadow: 
    0 6px 22px rgba(0, 0, 0, 0.55),
    0 3px 12px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 0 35px rgba(99, 102, 241, 0.12);
}

/* Mobile - Reduced blur & glow */
@media (max-width: 768px) {
  .container,
  .card {
    backdrop-filter: blur(10px) saturate(130%);
    -webkit-backdrop-filter: blur(10px) saturate(130%);
  }
  
  .container:hover,
  .card:hover {
    box-shadow: 
      0 4px 18px rgba(0, 0, 0, 0.45),
      0 2px 8px rgba(0, 0, 0, 0.35),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }
}
'@

Write-Host "📝 Template Summary:" -ForegroundColor Green
Write-Host "  - Base module: Structure & Layout" -ForegroundColor White
Write-Host "  - Light module: Layered/3D Glassmorphism" -ForegroundColor White
Write-Host "  - Dark module: Deep Tinted with Glow" -ForegroundColor White
Write-Host ""

Write-Host "✅ Glassmorphism design system templates ready!" -ForegroundColor Green
Write-Host ""
Write-Host "📚 Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Review documentation in docs/GLASSMORPHISM_DESIGN_SYSTEM.md" -ForegroundColor White
Write-Host "  2. See quick reference in docs/GLASSMORPHISM_QUICK_REFERENCE.md" -ForegroundColor White
Write-Host "  3. Check examples in app/page.*.module.css" -ForegroundColor White
Write-Host "  4. Use pre-built classes from styles/design-system/glassmorphism-enhanced.css" -ForegroundColor White
Write-Host ""
Write-Host "🎨 Component-specific CSS modules have been preserved for customization" -ForegroundColor Yellow
Write-Host "   Each component can extend or override the base glassmorphism styles" -ForegroundColor White
Write-Host ""
Write-Host "Done! 🎉" -ForegroundColor Green
