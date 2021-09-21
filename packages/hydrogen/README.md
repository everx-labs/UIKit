# Hydrogen

A set of primitives and core components for Surf design-system.

# Installation

```sh
# npm
npm install @tonlabs/uikit.hydrogen

# yarn
yarn add @tonlabs/uikit.hydrogen
```

## react-native-gesture-handler

Please be aware that one of the dependencies is `react-native-gesture-handler` library, that has [few important installation steps](https://docs.swmansion.com/react-native-gesture-handler/docs/#installation) you need not to forget.

# Fonts setup

Basic font for `hydrogen` is [Inter](https://rsms.me/inter/).

## Web

```ts
import { useWebFonts } from '@tonlabs/uikit.themes';
```

For better performance (faster font load) we recommend following setup with [dynamic imports](https://webpack.js.org/guides/code-splitting/#dynamic-imports) to load fonts as fast as possible:

```ts
// index.js
import { useWebFonts } from '@tonlabs/uikit.themes';

useWebFonts();

// To separate rest of the app out of critical part of a bundle
import('./App');
```

### Webpack

If you use `webpack` then you also need to setup `css-loader` (with `style-loader` to create `<style>` tags) and `file-loader`.

```js
module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.woff2?$/,
                loader: 'file-loader',
            },
        ],
    },
};
```

Also you need to setup few aliases, as paths in `react-native-web` are different than in RN.

```js
module.exports = {
    resolve: {
        alias: {
            'react-native/Libraries/ReactNative/AppContainer':
                'react-native-web/dist/exports/AppRegistry/AppContainer',
            'react-native/Libraries/Text/TextAncestor':
                'react-native-web/dist/exports/Text/TextAncestorContext',
            'react-native$': 'react-native-web',
        },
    },
};
```

## iOS

Browse to `node_modules/@tonlabs/uikit.hydrogen/assets/fonts` and drag all `*.ttf` files to your project in Xcode. Make sure that fonts are added to a proper target.

Edit `Info.plist` and add a property called **Fonts provided by application** and type in files you just added.

## Android

Edit `android/app/build.gradle` and add the following:

```groovy
apply from: "../../node_modules/@tonlabs/uikit.hydrogen/fonts.gradle"
```

# TODOs

-   [ ] Create podspec to link fonts with CocoaPods.
