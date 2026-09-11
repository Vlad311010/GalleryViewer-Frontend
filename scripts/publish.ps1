param(
    [Parameter(Mandatory = $true)]
    [string]$Target,

    [switch]$Strict
)

$ErrorActionPreference = "Stop"

$source = Join-Path $PSScriptRoot "..\dist"
$source = (Resolve-Path $source).Path

if (-not (Test-Path $source)) {
    throw "Build output not found: $source"
}

$target = [System.IO.Path]::GetFullPath($Target)

if ((Test-Path $target) -and $Strict) {
    throw "Target already exists: $target. Remove -Strict to replace it."
}

if ($(Test-Path $target)) {
    Remove-Item $target -Recurse -Force
}

New-Item -ItemType Directory -Path $target -Force | Out-Null

Copy-Item "$source\*" $target -Recurse -Force

Write-Host "Deployed to: $target"