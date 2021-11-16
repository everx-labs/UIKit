# UIVideo

## react-native-video installing

### iOS

#### Update ios/Podfile

Add following line to ios/Podfile and replace `${../node_modules}` with the `node_modules` path of your project:

```
pod 'react-native-video/VideoCaching', :path => '${../node_modules}/react-native-video/react-native-video.podspec'
```

### Android

#### Update android/settings.gradle

Add following lines to dependencies and replace `${../node_modules}` with the `node_modules` path of your project:

```
include ':react-native-video'
project(':react-native-video').projectDir = new File(rootProject.getProjectDir(), '${../node_modules}/react-native-video/android-exoplayer')
```
