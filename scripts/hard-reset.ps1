<#!
.SYNOPSIS
    Safely hard-resets a branch (local + remote) to a specified commit.

.DESCRIPTION
    Performs these steps:
      1. Fetches from remote.
      2. Verifies commit exists locally (fetch ensures this).
      3. Ensures working tree is clean (unless -AllowDirty provided).
      4. Creates a safety backup branch (unless -SkipBackup) from the current remote/<Branch> head.
      5. Optionally creates a tag (if -TagName provided) at the pre-reset point.
      6. Checks out the target branch locally.
      7. Hard resets to the specified commit.
      8. Force-pushes (--force-with-lease by default; can escalate to plain --force with -Force).

.PARAMETER Commit
    The target commit hash (full or short) to reset to.

.PARAMETER Branch
    The branch to reset (default: main).

.PARAMETER Remote
    Remote name (default: origin).

.PARAMETER SkipBackup
    Skip creating a backup branch.

.PARAMETER BackupPrefix
    Prefix for backup branch name (default: backup/pre-reset).

.PARAMETER TagName
    Optional tag to create at the pre-reset point.

.PARAMETER Force
    Use --force instead of --force-with-lease when pushing.

.PARAMETER AllowDirty
    Allow proceeding even if working tree has uncommitted changes.

.PARAMETER Yes
    Non-interactive; assume confirmation.

.EXAMPLE
    ./scripts/hard-reset.ps1 -Commit b8e8d5d3868f3e1a3db9d15b28a478351c9cd975

.EXAMPLE
    ./scripts/hard-reset.ps1 -Commit b8e8d5d3868f -Branch main -TagName pre-reset-2025-09-10

.NOTES
    Use with caution; this rewrites remote history.
#>

[CmdletBinding()] Param(
    [Parameter(Mandatory=$true)][string]$Commit,
    [string]$Branch = 'main',
    [string]$Remote = 'origin',
    [switch]$SkipBackup,
    [string]$BackupPrefix = 'backup/pre-reset',
    [string]$TagName,
    [switch]$Force,
    [switch]$AllowDirty,
    [switch]$Yes
)

function Write-Info($msg){ Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Write-Warn($msg){ Write-Host "[WARN] $msg" -ForegroundColor Yellow }
function Write-Err($msg){ Write-Host "[ERR ] $msg" -ForegroundColor Red }
function Confirm-Action($prompt){
    if($Yes){ return $true }
    $resp = Read-Host "$prompt (y/N)"
    return $resp -match '^(y|yes)$'
}

# 1. Fetch
Write-Info "Fetching from $Remote ..."
& git fetch --all --prune 2>$null | Out-Null
if($LASTEXITCODE -ne 0){ Write-Err "git fetch failed"; exit 1 }

# 2. Ensure commit exists
$fullCommit = (git rev-parse --verify $Commit 2>$null)
if(-not $fullCommit){ Write-Err "Commit $Commit not found after fetch."; exit 1 }
Write-Info "Target commit resolved to $fullCommit"

# 3. Check working tree cleanliness
$status = git status --porcelain
if($status -and -not $AllowDirty){
    Write-Err "Working tree not clean. Commit/stash or use -AllowDirty."
    exit 1
}
if($status -and $AllowDirty){ Write-Warn "Proceeding with dirty working tree (per -AllowDirty)." }

# 4. Determine current remote branch head
$remoteRef = "$Remote/$Branch"
$currentRemoteHead = (git rev-parse --verify $remoteRef 2>$null)
if(-not $currentRemoteHead){ Write-Err "Remote branch $remoteRef not found."; exit 1 }
Write-Info "Current remote $remoteRef = $currentRemoteHead"

if(-not $SkipBackup){
    $timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
    $backupBranch = "$BackupPrefix-$Branch-$timestamp"
    Write-Info "Creating backup branch $backupBranch at $currentRemoteHead"
    git branch $backupBranch $currentRemoteHead | Out-Null
    if($LASTEXITCODE -ne 0){ Write-Err "Failed to create backup branch."; exit 1 }
    Write-Info "Pushing backup branch to remote..."
    git push $Remote $backupBranch | Out-Null
    if($LASTEXITCODE -ne 0){ Write-Err "Failed to push backup branch."; exit 1 }
    Write-Info "Backup branch created: $backupBranch"
} else {
    Write-Warn "Skipping backup branch creation per -SkipBackup"
}

# Optional tag
if($TagName){
    if(git rev-parse --verify refs/tags/$TagName 2>$null){
        Write-Warn "Tag $TagName already exists, skipping."
    } else {
        Write-Info "Creating tag $TagName at $currentRemoteHead"
        git tag -a $TagName $currentRemoteHead -m "Pre-reset tag before resetting $Branch to $fullCommit"
        if($LASTEXITCODE -ne 0){ Write-Err "Failed to create tag."; exit 1 }
        git push $Remote refs/tags/$TagName | Out-Null
        if($LASTEXITCODE -ne 0){ Write-Err "Failed to push tag."; exit 1 }
    }
}

# 5. Checkout branch locally
$currentBranch = (git rev-parse --abbrev-ref HEAD).Trim()
if($currentBranch -ne $Branch){
    Write-Info "Checking out $Branch"
    git checkout $Branch | Out-Null
    if($LASTEXITCODE -ne 0){ Write-Err "Failed to checkout $Branch"; exit 1 }
}

# 6. Confirmation
Write-Warn "About to HARD RESET branch $Branch to $fullCommit and force push to $Remote (history rewrite)."
if(-not (Confirm-Action "Continue")){ Write-Err "Aborted by user"; exit 1 }

# 7. Hard reset
Write-Info "Resetting..."
git reset --hard $fullCommit | Out-Null
if($LASTEXITCODE -ne 0){ Write-Err "git reset failed."; exit 1 }

# 8. Force push
$pushFlag = '--force-with-lease'
if($Force){ $pushFlag = '--force' }
Write-Info "Pushing ($pushFlag) to $Remote $Branch"
& git push $pushFlag $Remote $Branch
if($LASTEXITCODE -ne 0){ Write-Err "Force push failed. You may need to allow force pushes in branch protection settings."; exit 1 }

Write-Info "Done. $Branch now points to $fullCommit on remote."
if(-not $SkipBackup){ Write-Info "Backup branch stored at remote as $backupBranch" }
if($TagName){ Write-Info "Tag created: $TagName" }

Write-Host "Next: Inform collaborators to sync via: git fetch && git checkout $Branch && git reset --hard $Remote/$Branch" -ForegroundColor Green
