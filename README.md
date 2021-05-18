UI components for react-native-web

# Flow types
We use `@react-navigation` as dependency and use typings for it from `flow-typed`. Please ensure that your project has it installed. You can use following command to install it:

```sh
npx flow-typed install @react-navigation/core@5.x.x @react-navigation/native@5.x.x @react-navigation/bottom-tabs@5.x.x @react-navigation/stack@5.x.x
```

# Run web

First run command `npx lerna bootstrap && npx lerna run prepare`

Second run `npm run web` or `yarn web`

# Run Mobile

Move to the `Example` folder `cd Example`

Run `npm run reinstall` or `yarn reinstall`

If pod install failure with Flipper-Glog dependency try `sudo xcode-select --switch /Applications/Xcode.app`

Run `npm run start` or `yarn start`

## iOS
Open `Example/ios` folder in XCode, build and run.
## Android
Open `Example/android` folder in Android Studio, build and run.

# Publish packages

```sh
npx lerna publish --no-private
```
