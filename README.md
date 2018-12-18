# UIKit
UI components kit

# Install in TON-Wallet
clone UIKit in src/services using
```
cd src/services && git clone https://github.com/tonlabs/UIKit
```

# Install in separate project
add to package.json in "dependencies":
```
"ui-kit": "git+https://github.com/tonlabs/UIKit.git"
```

then run:
```
npm install
npm install --save react && react-dom && react-native
react-native link react-native-localization
react-native link react-native-device-info
```

