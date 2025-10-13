## Frontend deployment to Oracle Cloud Infrastructure (OCI)

This repo includes a GitHub Actions workflow that builds your Next.js app and deploys the static export to OCI Object Storage as a public website.

### What you’ll set up

- OCI IAM permissions for a user to manage Object Storage in a target compartment
- An Object Storage bucket with website hosting
- A GitHub Actions workflow that builds and uploads your site
- GitHub repository secrets to authenticate the workflow to OCI

### 1) Create/choose a compartment

Use an existing compartment or create a dedicated one for the website (recommended).

Note the compartment OCID for later.

### 2) Create a deploy group and grant permissions

Create an IAM group (e.g., `ci-deployers`) and add the OCI user that will own the API key used by GitHub Actions.

Add this policy at tenancy level (or under the compartment’s policy with `in compartment <name>`):

```
Allow group ci-deployers to manage object-family in compartment <COMPARTMENT_NAME>
```

This grants the ability to create/update buckets and objects (static site hosting).

If you prefer using OCIDs:

```
Allow group ci-deployers to manage object-family in compartment id <COMPARTMENT_OCID>
```

### 3) Create an API key for that user

In Console: Identity & Security → Users → Your user → API Keys → Add API Key.

You can generate keys locally and paste the public key, or upload the public key file.

Keep these values for GitHub secrets:

- Tenancy OCID
- User OCID (for the user that owns the API key)
- Region (e.g., `us-ashburn-1`)
- Key fingerprint (displayed after you add the key)
- Private key (PEM contents) associated with the key/fingerprint

Optional local generation example (PowerShell):

```powershell
openssl genrsa -out $HOME\oci_api_key.pem 2048
openssl rsa -pubout -in $HOME\oci_api_key.pem -out $HOME\oci_api_key_public.pem
openssl rsa -pubout -outform DER -in $HOME\oci_api_key.pem | openssl md5 -c
```

The last command outputs the fingerprint you must add to the user in the Console with the matching public key.

### 4) Create a public bucket with website hosting (optional – workflow can create/update)

Bucket name example: `my-frontend-site`

Recommended settings:
- Public access type: ObjectReadWithoutList
- Website index document: `index.html`
- Website error document: `404.html`

The workflow will attempt to create/update the bucket with these settings if it doesn’t exist yet.

### 5) Add GitHub repository secrets

Required secrets used by `.github/workflows/deploy-oci-static.yml`:

- `OCI_TENANCY_OCID`
- `OCI_USER_OCID`
- `OCI_FINGERPRINT`
- `OCI_REGION` (e.g., `us-ashburn-1`)
- `OCI_PRIVATE_KEY` (PEM contents)
- `OCI_COMPARTMENT_OCID`
- `OCI_BUCKET_NAME`

You can set them with GitHub CLI (recommended):

```powershell
gh secret set OCI_TENANCY_OCID -b"ocid1.tenancy.oc1..."
gh secret set OCI_USER_OCID -b"ocid1.user.oc1..."
gh secret set OCI_FINGERPRINT -b"ab:cd:ef:..."
gh secret set OCI_REGION -b"us-ashburn-1"
gh secret set OCI_COMPARTMENT_OCID -b"ocid1.compartment.oc1..."
gh secret set OCI_BUCKET_NAME -b"my-frontend-site"

# For the private key, prefer file input to preserve formatting
gh secret set OCI_PRIVATE_KEY < $HOME\oci_api_key.pem
```

Or run the helper script: `scripts/setup-oci-gh-secrets.ps1`.

### 6) Build/export configuration

This repo is configured to export a static site when `NEXT_OUTPUT=export` is set. We added this to the workflow so Next.js generates the `out/` directory that gets uploaded to Object Storage.

If you rely on SSR or API routes at runtime, static export won’t include them. In that case, consider hosting on OCI Compute/Container/Functions instead.

### 7) Trigger the deployment

- Push to `main` or trigger the workflow manually from the Actions tab.
- The workflow will:
  - Build the Next.js site with `NEXT_OUTPUT=export`
  - Ensure the bucket exists and website hosting is enabled
  - Upload the contents of `out/` to the bucket
  - Print the website URL

### 8) Accessing the site

The workflow prints a URL like:

```
https://objectstorage.<region>.oraclecloud.com/n/<namespace>/b/<bucket>/o/index.html
```

You can set up a custom domain using OCI DNS by creating a CNAME to the bucket website endpoint.

### Troubleshooting

- 403 on objects: ensure bucket is public (ObjectReadWithoutList) and the object exists.
- 404 on routes: for static export, configure your Next.js to generate pages for those routes and consider enabling trailingSlash.
- Auth failures: verify fingerprint matches the private key and user OCID, and policy allows `manage object-family` in the specified compartment.
