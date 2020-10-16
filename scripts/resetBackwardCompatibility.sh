find ./packages/legacy/src/UIAccountPicker/components/ -type f -name '*.js' -print0 | xargs -0 sed -i '' -e 's/..\/..\/..\/..\/core\/src/@uikit\/core/g'
find ./packages/legacy/src/UIAccountPicker/controllers/ -type f -name '*.js' -print0 | xargs -0 sed -i '' -e 's/..\/..\/..\/..\/core\/src/@uikit\/core/g'
find ./packages -type f -name '*.js' -print0 | xargs -0 sed -i '' -e 's/..\/..\/..\/core\/types/@uikit\/core\/types/g'
find ./packages -type f -name '*.js' -print0 | xargs -0 sed -i '' -e 's/..\/..\/..\/core\/src/@uikit\/core/g'

find ./packages/legacy/src/UIAccountPicker/components/ -type f -name '*.js' -print0 | xargs -0 sed -i '' -e 's/..\/..\/..\/..\/components\/src/@uikit\/components/g'
find ./packages/legacy/src/UIAccountPicker/controllers/ -type f -name '*.js' -print0 | xargs -0 sed -i '' -e 's/..\/..\/..\/..\/components\/src/@uikit\/components/g'
find ./packages -type f -name '*.js' -print0 | xargs -0 sed -i '' -e 's/..\/..\/..\/components\/src/@uikit\/components/g'

find ./packages -type f -name '*.js' -print0 | xargs -0 sed -i '' -e 's/..\/..\/..\/legacy\/src/@uikit\/legacy/g'

find ./packages/legacy/src/UIAccountPicker/controllers -type f -name '*.js' -print0 | xargs -0 sed -i '' -e 's/..\/..\/..\/..\/navigation\/src/@uikit\/navigation/g'
find ./packages -type f -name '*.js' -print0 | xargs -0 sed -i '' -e 's/..\/..\/..\/navigation\/src/@uikit\/navigation/g'

find ./packages -type f -name '*.js' -print0 | xargs -0 sed -i '' -e 's/..\/..\/..\/assets/@uikit\/assets/g'