UI components for react-native-web

# Flow types
We use `@react-navigation` as dependency and use typings for it from `flow-typed`. Please ensure that your project has it installed. You can use following command to install it:

```sh
npx flow-typed install @react-navigation/core@5.x.x @react-navigation/native@5.x.x @react-navigation/bottom-tabs@5.x.x @react-navigation/stack@5.x.x
```

# Run example

First run command `npx lerna bootstrap && npx lerna run prepare`

Second run `npm run web` or `yarn web`

# Publish packages

```sh
npx lerna publish --no-private
```

# Run iOS

First run command `npx lerna bootstrap && npx lerna run prepare`

Then move to the `ios` folder `cd Example/ios`

If cocoapods is not installed install it `sudo gem install cocoapods`
Install pods `pod install`

If pod install failure with Flipper-Glog dependency try `sudo xcode-select --switch /Applications/Xcode.app` and rerun `pod install`

Open `Example/ios` folder in XCode, build and run.

Run `yarn run start` from `Example` folder.
