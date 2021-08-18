UI components for react-native

# Run web

First run command `npx lerna bootstrap && npx lerna run prepare`

Second run `npm run web` or `yarn web`

# Run Mobile

Move to the `Example` folder `cd Example`

Run `npm run reinstall` or `yarn reinstall`

Run `npm run start` or `yarn start`

## iOS
Open `Example/ios` folder in XCode, build and run.
## Android
Open `Example/android` folder in Android Studio, build and run.

# Publish packages

```sh
npx lerna publish --no-private
```

## Troubleshooting
If pod install failure with Flipper-Glog dependency try `sudo xcode-select --switch /Applications/Xcode.app`
