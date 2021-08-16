# Fix `localized-strings` to make it work with Lokalize.com
# be carefull with sed. it works deifferently with differents OS 
# https://stackoverflow.com/questions/43171648/sed-gives-sed-cant-read-no-such-file-or-directory
sed -i '' -e '195s/.*/      } else if (typeof strings[key] !== "string" \&\& typeof strings[key].valueOf() !== "string") {/' ./node_modules/localized-strings/lib/LocalizedStrings.js

# Jetify Android dependencies
./node_modules/.bin/jetify