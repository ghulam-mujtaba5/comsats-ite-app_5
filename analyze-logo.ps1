Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile('e:\comsats-ite-app_5\public\new-logo.jpg')
Write-Host "Image Dimensions: $($img.Width) x $($img.Height)"
Write-Host "Pixel Format: $($img.PixelFormat)"
$img.Dispose()
