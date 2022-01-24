# Fix `localized-strings` to make it work with Lokalize.com
# be carefull with sed. it works deifferently with differents OS 
# https://stackoverflow.com/questions/43171648/sed-gives-sed-cant-read-no-such-file-or-directory
sed -i '' -e '195s/.*/      } else if (typeof strings[key] !== "string" \&\& typeof strings[key].valueOf() !== "string") {/' ./node_modules/localized-strings/lib/LocalizedStrings.js

# Patch Android
## Remove `jcenter` in favour of `google` or `mavenCentral`

### Patch `react-native-android-keyboard-adjust`
sed -i '' -e '3s/.*/    google()\
    mavenCentral()/' ./node_modules/react-native-android-keyboard-adjust/android/build.gradle
sed -i '' -e '7s/.*/    classpath("com.android.tools.build:gradle:4.2.2")/' ./node_modules/react-native-android-keyboard-adjust/android/build.gradle

### Patch `react-native-animateable-text`
sed -i '' -e '7s/.*/    mavenCentral()/' ./node_modules/react-native-animateable-text/android/build.gradle

### Patch `react-native-camera`
sed -i '' -e '13d' ./node_modules/react-native-camera/android/build.gradle
sed -i '' -e '58d' ./node_modules/react-native-camera/android/build.gradle

## Jetify Android dependencies
./node_modules/.bin/jetify