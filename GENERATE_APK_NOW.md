# Generate AgriSathi APK - Step by Step Guide

## Option 1: Quick Setup (Recommended)

### Step 1: Install Android Studio
1. Download Android Studio from: https://developer.android.com/studio
2. Run the installer and follow the setup wizard
3. During installation, make sure to install:
   - Android SDK
   - Android SDK Platform-Tools
   - Android SDK Build-Tools
   - Accept all license agreements

### Step 2: Set Environment Variable
After Android Studio installation, open PowerShell as Administrator and run:
```powershell
# Find your Android SDK path (usually one of these):
# C:\Users\YourUsername\AppData\Local\Android\Sdk
 C:\Android\Sdk

# Set the environment variable (replace with your actual path)
[Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk", "User")
[Environment]::SetEnvironmentVariable("PATH", $env:PATH + ";C:\Users\$env:USERNAME\AppData\Local\Android\Sdk\platform-tools;C:\Users\$env:USERNAME\AppData\Local\Android\Sdk\tools", "User")
```

### Step 3: Restart Your Terminal
Close and reopen your terminal/PowerShell to load the new environment variables.

### Step 4: Generate APK
```bash
# Build the web app and sync
npm run build:mobile

# Navigate to android directory and build APK
cd android
.\gradlew assembleDebug
```

**Your APK will be created at:** `android\app\build\outputs\apk\debug\app-debug.apk`

## Option 2: Using Android Studio GUI (Easier)

### After installing Android Studio:

1. **Open the project in Android Studio:**
   ```bash
   npm run cap:open
   ```

2. **In Android Studio:**
   - Wait for Gradle sync to complete (may take 5-10 minutes first time)
   - Go to **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
   - Wait for build to complete
   - Click "locate" when build finishes to find your APK

## Option 3: Alternative - Create local.properties file

If you don't want to set environment variables, create this file:

**File:** `android/local.properties`
```
sdk.dir=C:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk
```
(Replace `YourUsername` with your actual Windows username)

Then run:
```bash
cd android
.\gradlew assembleDebug
```

## Troubleshooting

### If you get "SDK location not found" error:
1. Find your Android SDK location (usually `C:\Users\YourUsername\AppData\Local\Android\Sdk`)
2. Create `android/local.properties` file with the SDK path
3. Try building again

### If Gradle build fails:
1. Make sure you accepted all Android SDK licenses in Android Studio
2. Try: `cd android && .\gradlew clean && .\gradlew assembleDebug`

## Quick Commands Summary

```bash
# Install dependencies (already done)
npm install

# Build web app and sync with Android
npm run build:mobile

# Open in Android Studio (recommended)
npm run cap:open

# OR build via command line
cd android
.\gradlew assembleDebug
```

## What happens next?

1. **APK Location:** `android\app\build\outputs\apk\debug\app-debug.apk`
2. **Install on phone:** Transfer APK to your Android device and install
3. **Or use ADB:** `adb install android\app\build\outputs\apk\debug\app-debug.apk`

Your AgriSathi app will be ready to install on any Android device! 🚀
