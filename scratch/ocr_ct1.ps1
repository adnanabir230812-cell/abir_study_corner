Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Runtime.WindowsRuntime
[void][Windows.Media.Ocr.OcrEngine, Windows.Foundation, ContentType = WindowsRuntime]
[void][Windows.Storage.Streams.RandomAccessStream, Windows.Storage.Streams, ContentType = WindowsRuntime]
[void][Windows.Graphics.Imaging.BitmapDecoder, Windows.Graphics.Imaging, ContentType = WindowsRuntime]
[void][Windows.Graphics.Imaging.SoftwareBitmap, Windows.Graphics.Imaging, ContentType = WindowsRuntime]

$imagePath = "E:\Abir study\3.2 1st Part\3.2 1st Part\AT-3203 Crop Ecology\Sarwar Sir\CT1.jpg"

if (-not (Test-Path $imagePath)) {
    Write-Error "Image file not found: $imagePath"
    exit 1
}

[void][Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime]
[void][Windows.Storage.FileAccessMode, Windows.Storage, ContentType = WindowsRuntime]

$file = [Windows.Storage.StorageFile]::GetFileFromPathAsync($imagePath).GetAwaiter().GetResult()
$randomAccessStream = $file.OpenAsync([Windows.Storage.FileAccessMode]::Read).GetAwaiter().GetResult()

$ocrEngine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()

if ($ocrEngine -eq $null) {
    Write-Error "OCR engine could not be initialized. Check language packs."
    exit 1
}

$decoder = [Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($randomAccessStream).GetAwaiter().GetResult()
$softwareBitmap = $decoder.GetSoftwareBitmapAsync().GetAwaiter().GetResult()

$ocrResult = $ocrEngine.RecognizeAsync($softwareBitmap).GetAwaiter().GetResult()

Write-Host "--- OCR Result for CT1.jpg ---"
$ocrResult.Lines | ForEach-Object { Write-Host $_.Text }
Write-Host "-----------------------------"
