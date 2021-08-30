UI components for react-native

# Install UIKit packages

```
npx lerna bootstrap && npx lerna run prepare
```

# Run Quiver UI application on web

```
npm run web
```

or

```
yarn web
```

# Run Quiver UI application on mobile

Move to the `Example` folder `cd Example`

Install pods for iOS or run `npm run reinstall` or `yarn reinstall` to do it automatically

```
npm run start
```

or

```
yarn start
```

## iOS

Open `Example/ios` folder in XCode, build and run.

## Android

Open `Example/android` folder in Android Studio, build and run.

# Publish UIKit packages

```sh
npx lerna publish --no-private
```

# Releasing Quiver UI application

It might be necessary to install `npx` globally, if you still haven't just run:

```
npm install -g npx
```

This project has some sensitive data including configuration keys and keystore object. To encrypt it we use [git-secret](https://git-secret.io). A recommended way to install it on Mac is using **Homebrew**:

```
brew install git-secret
```

_N.B. Before making a release build, please ensure you have an access to encrypted data by giving your GPG public key and a USER_ID (such as a key ID, a full fingerprint, an email address, or anything else that uniquely identifies that key to GPG) to any project contributor who can provide such an access._

## Troubleshooting

If pod install fails with Flipper-Glog dependency try

```
sudo xcode-select --switch /Applications/Xcode.app
```
