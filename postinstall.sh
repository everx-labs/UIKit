# Fix `localized-strings` to make it work with Lokalize.com
# be carefull with sed. it works deifferently with differents OS 
# https://stackoverflow.com/questions/43171648/sed-gives-sed-cant-read-no-such-file-or-directory
sed -i '' -e '195s/.*/      } else if (typeof strings[key] !== "string" \&\& typeof strings[key].valueOf() !== "string") {/' ./node_modules/localized-strings/lib/LocalizedStrings.js

# Fix `react-native-reanimated` for web (https://github.com/software-mansion/react-native-reanimated/issues/2714)
sed -i '' -e '4s/.*/import { nativeShouldBeMock, shouldBeUseWeb, isWeb } from ".\/PlatformChecker";/' ./node_modules/react-native-reanimated/lib/reanimated2/core.js
sed -i '' -e '266s/.*/    if (!isWeb() \&\& isConfigured()) {/' ./node_modules/react-native-reanimated/lib/reanimated2/core.js
sed -i '' -e '267s/.*/        const capturableConsole = console;/' ./node_modules/react-native-reanimated/lib/reanimated2/core.js
sed -i '' -e '282i\
    }' ./node_modules/react-native-reanimated/lib/reanimated2/core.js

# Jetify Android dependencies
./node_modules/.bin/jetify