param(
  [Parameter(Mandatory=$true)] [string]$TenancyOcid,
  [Parameter(Mandatory=$true)] [string]$UserOcid,
  [Parameter(Mandatory=$true)] [string]$Fingerprint,
  [Parameter(Mandatory=$true)] [string]$Region,
  [Parameter(Mandatory=$true)] [string]$CompartmentOcid,
  [Parameter(Mandatory=$true)] [string]$BucketName,
  [Parameter(Mandatory=$true)] [string]$PrivateKeyPath
)

# Requires GitHub CLI (gh) installed and authenticated against this repo.
$ErrorActionPreference = 'Stop'

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  Write-Error 'GitHub CLI (gh) is required. Install from https://cli.github.com/'
}

Write-Host 'Setting GitHub secrets for OCI deployment...'

gh secret set OCI_TENANCY_OCID -b"$TenancyOcid"

gh secret set OCI_USER_OCID -b"$UserOcid"

gh secret set OCI_FINGERPRINT -b"$Fingerprint"

gh secret set OCI_REGION -b"$Region"

gh secret set OCI_COMPARTMENT_OCID -b"$CompartmentOcid"

gh secret set OCI_BUCKET_NAME -b"$BucketName"

# Private key via file to preserve formatting
if (-not (Test-Path $PrivateKeyPath)) {
  Write-Error "Private key not found at $PrivateKeyPath"
}

gh secret set OCI_PRIVATE_KEY < $PrivateKeyPath

Write-Host 'All required secrets have been set.'