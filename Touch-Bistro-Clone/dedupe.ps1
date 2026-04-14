$galleryDir = 'C:\Users\nicol\Touch-Bistro-Clone\public\screenshots\gallery'
$files = Get-ChildItem -Path $galleryDir -Filter 'gallery_*.png' | Sort-Object { [int]($_ -replace '\D','') }

$seenHashes = @{}
$uniqueFiles = @()

foreach ($file in $files) {
    $hash = (Get-FileHash -Path $file.FullName -Algorithm MD5).Hash
    if (-not $seenHashes.ContainsKey($hash)) {
        $seenHashes[$hash] = $true
        $uniqueFiles += $file
    } else {
        Write-Host "Deleting duplicate: $($file.Name)"
        Remove-Item -Path $file.FullName
    }
}

Write-Host "Found $($uniqueFiles.Count) unique files. Renaming to sequential order..."

$newIndex = 1
$newNames = @()
foreach ($file in $uniqueFiles) {
    $tempName = "temp_gallery_${newIndex}.png"
    Rename-Item -Path $file.FullName -NewName $tempName
    $newNames += "gallery_${newIndex}.png"
    $newIndex++
}

$newIndex = 1
foreach ($file in $uniqueFiles) {
    $tempName = "temp_gallery_${newIndex}.png"
    $finalName = "gallery_${newIndex}.png"
    Rename-Item -Path (Join-Path $galleryDir $tempName) -NewName $finalName
    $newIndex++
}

# Update both READMEs
$readmePaths = @(
    'C:\Users\nicol\Touch-Bistro-Clone\README.md',
    'C:\Users\nicol\README.md'
)

foreach ($readmePath in $readmePaths) {
    $content = Get-Content -Path $readmePath -Raw
    
    # We will use Regex to replace the entire gallery section
    # Find start and end points
    $startMarker = "<summary><b>Click to expand full interface gallery"
    $endMarker = "</details>"
    
    if ($content -match "(?s)(.*$startMarker.*?\n\n)(.*?)(</details>.*)") {
        $prefix = $matches[1]
        $suffix = $matches[3]
        
        $galleryText = ""
        $index = 1
        foreach ($name in $newNames) {
            if ($readmePath -match 'Touch-Bistro-Clone') {
                $galleryText += "![POS Walkthrough](./public/screenshots/gallery/gallery_${index}.png)`n"
            } else {
                $galleryText += "![POS Walkthrough](./Touch-Bistro-Clone/public/screenshots/gallery/gallery_${index}.png)`n"
            }
            $index++
        }
        
        $newContent = $prefix + $galleryText + "`n" + $suffix
        Set-Content -Path $readmePath -Value $newContent -NoNewline
        Write-Host "Updated README: $readmePath"
    } else {
        Write-Host "Could not find gallery block in $readmePath"
    }
}
