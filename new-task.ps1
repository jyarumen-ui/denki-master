param([Parameter(Mandatory=$true)][string]$TaskName)
$PlanFile = "plan-$($TaskName -replace '[^\w]', '-').md"
Copy-Item "plan-template.md" $PlanFile
Write-Host "=== 新タスク: $TaskName ===" -ForegroundColor Cyan
Write-Host "STEP 1 [Claude]  $PlanFile を編集" -ForegroundColor Yellow
Write-Host "STEP 2 [Codex]   /codex:rescue で実装委譲" -ForegroundColor Green
Write-Host "STEP 3 [Codex]   /codex:review" -ForegroundColor Magenta
Write-Host "STEP 4 [Claude]  /clear でリセット" -ForegroundColor Red
Start-Process notepad.exe $PlanFile
