# AgriSathi APK Build Guide

Your React app has been successfully configured with Capacitor for Android development! Here's how to complete the APK build process:

## Prerequisites Setup

### 1. Install Android Studio
- Download and install Android Studio from: https://developer.android.com/studio
- During installation, make sure to install:
  - Android SDK
  - Android SDK Platform-Tools
  - Android SDK Build-Tools
  - Android Emulator (optional, for testing)

### 2. Set Environment Variables
After installing Android Studio, set up these environment variables:

**Windows (PowerShell):**
```powershell
# Add to your PowerShell profile or set permanently in System Properties
$env:ANDROID_HOME = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\tools;$env:ANDROID_HOME\platform-tools"
```

**Alternative: Create local.properties file**
Create a file `android/local.properties` with:
```
sdk.dir=C:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk
```

## Build Commands

### Option 1: Build APK via Command Line
```bash
# Build the web app and sync with Capacitor
npm run build:mobile

# Navigate to android directory and build
cd android
.\gradlew assembleDebug
```

The APK will be generated at: `android/app/build/outputs/apk/debug/app-debug.apk`

### Option 2: Build via Android Studio (Recommended)
```bash
# Open the Android project in Android Studio
npm run cap:open
```

Then in Android Studio:
1. Wait for Gradle sync to complete
2. Go to Build → Build Bundle(s) / APK(s) → Build APK(s)
3. The APK will be generated in `app/build/outputs/apk/debug/`

## Available NPM Scripts

- `npm run build:mobile` - Build web app and sync with Capacitor
- `npm run android` - Run on connected Android device
- `npm run android:dev` - Run with live reload for development
- `npm run cap:sync` - Sync web assets with native project
- `npm run cap:open` - Open Android project in Android Studio

## App Configuration

Your app is configured with:
- **App Name:** AgriSathi
- **Package ID:** com.agrisathi.app
- **Theme Color:** Green (#22c55e)
- **Splash Screen:** 2-second duration with green background

## Testing the APK

1. **Install on Device:**
   ```bash
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

2. **Or transfer the APK file to your Android device and install manually**

## Production Build

For production release:
```bash
cd android
.\gradlew assembleRelease
```

Note: You'll need to set up signing keys for production builds.

## Troubleshooting

1. **SDK not found error:** Ensure ANDROID_HOME is set correctly
2. **Gradle sync issues:** Try File → Invalidate Caches and Restart in Android Studio
3. **Build errors:** Check that you have the required Android SDK versions installed

## Next Steps

1. Install Android Studio and SDK
2. Set up environment variables
3. Run `npm run cap:open` to open in Android Studio
4. Build your APK!

Your AgriSathi app is ready to be built as an Android APK! 🚀
