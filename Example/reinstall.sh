npx lerna bootstrap
npx lerna run prepare

bundle install

cd ios
rm -rf Pods
bundle exec pod install
cd ..

if command -v osascript &> /dev/null
then
  osascript -e "display notification \"Waiting for secret files revealing\" with title \"Quiver UI\""
fi

cd ..
yarn run secret:reveal
cd Example

if command -v osascript &> /dev/null
then
  osascript -e "display notification \"Reinstalled!\" with title \"Quiver UI\""
fi