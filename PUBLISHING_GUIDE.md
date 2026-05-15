# SafeCircle PK - Play Store Publishing Guide

Follow these steps to build and publish the app to the Google Play Store.

## Step 1: Generate a Signing Key (Keystore)
Run this command in your terminal (inside the `android/app` folder):
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```
*Keep this file safe! If you lose it, you cannot update your app.*

## Step 2: Configure Gradle Variables
Edit `~/.gradle/gradle.properties` or `android/gradle.properties` and add:
```properties
MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=*****
MYAPP_UPLOAD_KEY_PASSWORD=*****
```

## Step 3: Firebase Production Setup
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Add your Android App with package name `com.tracker`.
3. Add your **SHA-1 fingerprint** (generate it using `./gradlew signingReport`).
4. Download `google-services.json` and place it in `android/app/`.

## Step 4: Build the Release Bundle (AAB)
Run the following commands:
```bash
cd android
./gradlew bundleRelease
```
The build file will be at: `android/app/build/outputs/bundle/release/app-release.aab`

## Step 5: Google Play Console Setup
1. Log in to the [Google Play Console](https://play.google.com/console).
2. Create a new app and fill in the **Store Listing** (Title, Description, Icons, Screenshots).
3. **App Content**: Complete the mandatory declarations:
    *   **Privacy Policy**: Link to your hosted privacy policy.
    *   **Location Permissions**: You MUST record a video showing how the app uses background location and explain why it's necessary for family safety.
    *   **Data Safety Section**: Disclose that you collect and share "Precise Location".

## Step 6: Internal/Production Testing
1. Go to **Testing > Internal Testing** or **Production**.
2. Create a new release and upload the `app-release.aab` file.
3. Submit for review. (Note: The first review for location apps can take 7+ days).
