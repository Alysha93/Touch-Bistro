$sourceReadme = Get-Content 'C:\Users\nicol\Touch-Bistro-Clone\README.md' -Raw
$correctedReadme = $sourceReadme -replace '\]\(\./public', '](./Touch-Bistro-Clone/public'
Set-Content -Path 'C:\Users\nicol\README.md' -Value $correctedReadme
Write-Host 'Root README updated successfully.'
