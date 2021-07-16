# A place to hold all of the research done in preparation for building this project

Might become part of an article or just a glossary/reference sheet for me.

---

## Tools/Utilities to Install

### React Native

#### Expo

https://docs.expo.io/get-started/installation/

```sh
npm install --global expo-cli
```

### Android Studio (Plus Android Emulator)

https://docs.expo.io/workflow/android-studio-emulator/

*NOTE: Requires Security & Privacy setting change which requires a system restart.

Running the emulator: https://developer.android.com/studio/run/emulator

1. Android Emulator installed by default installation of Android Studio. Verify with Preferences - SDK Manager - SDK Tools - Android Emulator
2. Open AVD Manager in Android Studio to select and install an Android device to emulate (download sources can be slow)

Android Debug Bridge install directions:

https://docs.expo.io/workflow/android-studio-emulator/

*NOTE: You'll need to source or restart terminal after updating your bash_profile/zshrc

Expo has "Managed" and "Bare" initializations; the Managed defaults to TypeScript with React Native routing.
Expo app requires Expo SDK 39+ (current latest is 42 as of this writing 7/16/21). Once Expo SDK is outdated you cannot continue to update your app.


```sh
adb version
```

---

## Tutorials, Articles, Docs

### React Native Plus Firebase

https://github.com/instamobile/react-native-firebase

```sh
git clone https://github.com/instamobile/react-native-firebase.git
cd react-native-firebase
expo eject
npm install
react-native run-android // react-native run-ios
```

