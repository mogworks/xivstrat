@echo off
echo Generating Tauri icons...

REM Create icons directory if not exists
if not exist "src-tauri\icons" mkdir "src-tauri\icons"

REM Run the icon generation script
pnpm tauri:icon

echo.
echo If the above command failed, you need to manually create the following files:
echo - src-tauri\icons\32x32.png (32x32 pixels)
echo - src-tauri\icons\128x128.png (128x128 pixels)
echo - src-tauri\icons\128x128@2x.png (256x256 pixels)
echo - src-tauri\icons\icon.png (1024x1024 pixels)
echo - src-tauri\icons\icon.ico (Windows icon file)
echo - src-tauri\icons\icon.icns (macOS icon file)
echo.
echo You can use online converters like:
echo - https://convertio.co/svg-ico/
echo - https://cloudconvert.com/svg-to-ico
echo - https://icoconvert.com/
echo.
pause