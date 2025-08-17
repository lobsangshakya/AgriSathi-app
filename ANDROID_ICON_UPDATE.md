# Android App Icon Update Guide

## Current Status
✅ **Web App Icons Updated**: The web app now uses the proper AgriSaathi logo as favicon
✅ **HTML Meta Tags Updated**: All icon references point to the correct logo
✅ **Public Assets Added**: Logo files added to public directory for better compatibility

## Android App Icons
⚠️ **Still Using Default Icons**: The Android app is currently using the default Capacitor launcher icons

## How to Update Android Icons

### Option 1: Using @capacitor/assets (Recommended)

1. **Install the assets plugin:**
   ```bash
   npm install @capacitor/assets
   ```

2. **Generate Android icons:**
   ```bash
   npx @capacitor/assets generate --iconPath src/assets/Logo.png
   ```

3. **Sync with Android:**
   ```bash
   npx cap sync android
   ```

### Option 2: Manual Replacement

1. **Navigate to Android icon directories:**
   ```
   android/app/src/main/res/
   ├── mipmap-hdpi/
   ├── mipmap-mdpi/
   ├── mipmap-xhdpi/
   ├── mipmap-xxhdpi/
   └── mipmap-xxxhdpi/
   ```

2. **Replace icon files in each directory:**
   - `ic_launcher.png` (square icon)
   - `ic_launcher_round.png` (round icon)
   - `ic_launcher_foreground.png` (adaptive icon foreground)

3. **Update icon background color:**
   Edit `android/app/src/main/res/values/ic_launcher_background.xml`:
   ```xml
   <color name="ic_launcher_background">#22c55e</color>
   ```

## Icon Requirements

- **Source Image**: `src/assets/Logo.png` (475x471 PNG)
- **Background Color**: `#22c55e` (AgriSaathi green)
- **Formats**: PNG with transparency support
- **Sizes**: Multiple densities for different screen resolutions

## After Icon Update

1. **Clean and rebuild:**
   ```bash
   npx cap clean android
   npx cap sync android
   ```

2. **Test on device/emulator:**
   - Uninstall previous app version
   - Install new version
   - Verify new icon appears

## Current Icon Files

- **Web Favicon**: ✅ Updated to use Logo.png
- **Apple Touch Icon**: ✅ Updated to use Logo.png
- **Android Launcher**: ⚠️ Still using default icons
- **Splash Screen**: ✅ Using AgriSaathi green (#22c55e)

## Next Steps

1. Run the @capacitor/assets command to generate proper Android icons
2. Test the updated icons on Android devices
3. Commit and push the new icon files
4. Update this guide with the results

## Notes

- The web app icons are now properly configured
- Android icons require additional steps due to platform-specific requirements
- The logo file (Logo.png) is properly sized and formatted for icon generation
