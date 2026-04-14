$sourceDir = 'C:\Users\nicol\.gemini\antigravity\brain\01e2c442-5137-4d8a-9090-88388b0002f6'
$destDir = 'C:\Users\nicol\Touch-Bistro-Clone\public\screenshots\gallery'
$StartingIndex = 27

$files = Get-ChildItem -Path $sourceDir -Filter 'media__*.png' | Sort-Object CreationTime

foreach ($file in $files) {
    $newName = "gallery_${StartingIndex}.png"
    Copy-Item -Path $file.FullName -Destination (Join-Path $destDir $newName)
    $StartingIndex++
}

Write-Host "Copied $($files.Count) files."
