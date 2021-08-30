npx lerna bootstrap
npx lerna run prepare

cd ios
rm -rf Pods
pod install
cd ..

if command -v osascript &> /dev/null
then
  osascript -e "display notification \"Waiting for secret files revealing\" with title \"Quiver UI\""
fi

npm run secret:reveal

if command -v osascript &> /dev/null
then
  osascript -e "display notification \"Reinstalled!\" with title \"Quiver UI\""
fi