$screenshotDir = 'C:\Users\nicol\OneDrive\Pictures\Screenshots'
$destinationDir = 'public\screenshots\gallery'
New-Item -ItemType Directory -Force -Path $destinationDir | Out-Null

$files = Get-ChildItem -Path $screenshotDir -File | Where-Object { 
  ($_.Name -match '^Screenshot 2026-04-12 11(4[6-9]|5[0-8])\d{2}\.png$') -and ($_.Name -notmatch 'Copy') 
} | Sort-Object LastWriteTime

$counter = 1
foreach ($file in $files) {
    $newName = "gallery_$counter.png"
    Copy-Item $file.FullName -Destination (Join-Path $destinationDir $newName)
    Write-Output "Copied $($file.Name) to $newName"
    $counter++
}
