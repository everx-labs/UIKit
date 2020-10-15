find ./packages/legacy/src/UIAccountPicker/components/ -type f -name '*.js' -print0 | xargs -0 sed -i '' -e 's/@uikit\/core/..\/..\/..\/..\/core\/src/g'
find ./packages/legacy/src/UIAccountPicker/controllers/ -type f -name '*.js' -print0 | xargs -0 sed -i '' -e 's/@uikit\/core/..\/..\/..\/..\/core\/src/g'
find ./packages -type f -name '*.js' -print0 | xargs -0 sed -i '' -e 's/@uikit\/core/..\/..\/..\/core\/src/g'

find ./packages/legacy/src/UIAccountPicker/components/ -type f -name '*.js' -print0 | xargs -0 sed -i '' -e 's/@uikit\/components/..\/..\/..\/..\/components\/src/g'
find ./packages/legacy/src/UIAccountPicker/controllers/ -type f -name '*.js' -print0 | xargs -0 sed -i '' -e 's/@uikit\/components/..\/..\/..\/..\/components\/src/g'
find ./packages -type f -name '*.js' -print0 | xargs -0 sed -i '' -e 's/@uikit\/components/..\/..\/..\/components\/src/g'

find ./packages -type f -name '*.js' -print0 | xargs -0 sed -i '' -e 's/@uikit\/legacy/..\/..\/..\/legacy\/src/g'

find ./packages/legacy/src/UIAccountPicker/controllers -type f -name '*.js' -print0 | xargs -0 sed -i '' -e 's/@uikit\/navigation/..\/..\/..\/..\/navigation\/src/g'
find ./packages -type f -name '*.js' -print0 | xargs -0 sed -i '' -e 's/@uikit\/navigation/..\/..\/..\/navigation\/src/g'

find ./packages -type f -name '*.js' -print0 | xargs -0 sed -i '' -e 's/@uikit\/assets/..\/..\/..\/assets/g'