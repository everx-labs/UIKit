npx lerna bootstrap
npx lerna run prepare
cd ios
rm -rf Pods
pod install
cd ..