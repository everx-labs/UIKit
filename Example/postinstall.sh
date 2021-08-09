# Fix `localized-strings` to make it work with Lokalize.com
sed -i '' -e '195s/.*/      } else if (typeof strings[key] !== "string" \&\& typeof strings[key].valueOf() !== "string") {/' ../node_modules/localized-strings/lib/LocalizedStrings.js

# Jetify Android dependencies
./node_modules/.bin/jetify