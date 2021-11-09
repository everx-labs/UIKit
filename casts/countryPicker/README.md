# Country picker

## react-native-android-keyboard-adjust installing

### Update android/app/build.gradle

Add `compile project(":react-native-android-keyboard-adjust")` to dependencies:

```
dependencies {
    ...
    compile project(":react-native-android-keyboard-adjust")
    ...
 }
```

### Update android/settings.gradle

```
...
include ':react-native-android-keyboard-adjust'
project(':react-native-android-keyboard-adjust').projectDir = new File(settingsDir, '../node_modules/react-native-android-keyboard-adjust/android')
...
```
