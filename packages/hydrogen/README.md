# Hydrogen

A set of primitives and core components for Surf design-system.

# Installation

```sh
# npm
npm install @tonlabs/uikit.hydrogen

# yarn
yarn add @tonlabs/uikit.hydrogen
```

# Fonts setup

Basic font for `hydrogen` is [Inter](https://rsms.me/inter/).

## Web

```ts
import { useWebFonts } from '@tonlabs/uikit.hydrogen';
```

For better performance (faster font load) we recommend following setup with [dynamic imports](https://webpack.js.org/guides/code-splitting/#dynamic-imports) to load fonts as fast as possible:

```ts
// index.js
import { useWebFonts } from '@tonlabs/uikit.hydrogen';

useWebFonts();

// To separate rest of the app out of critical part of a bundle
import('./App');
```

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
