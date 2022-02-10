const madge = require('madge');
const path = require('path');
const { parseDependencyTree, parseCircular, prettyCircular } = require('dpdm');

const checkCircularDependencies = async () => {
    try {
        console.log('Testing for circular dependencies using "DPDM"...');
        const sources = [
            'index.js',
            'Example/index.js',

            'localization/src/index.ts',

            'kit/assets/src/index.ts',
            'kit/controls/src/index.ts',
            'kit/inputs/src/index.ts',
            'kit/layout/src/index.ts',
            'kit/media/src/index.ts',
            'kit/popups/src/index.ts',
            'kit/scrolls/src/index.ts',
            'kit/themes/src/index.ts',

            'casts/accountPicker/src/index.ts',
            'casts/addressText/src/index.ts',
            'casts/banner/src/index.ts',
            'casts/bars/src/index.ts',
            'casts/blurView/src/index.ts',
            'casts/cards/src/index.ts',
            'casts/carouselView/src/index.ts',
            'casts/countryPicker/src/index.ts',
            'casts/dateTimePicker/src/index.ts',
            'casts/linearChart/src/index.ts',
            'casts/modalNavigator/src/index.ts',
            'casts/numbers/src/index.ts',
            'casts/pagerView/src/index.ts',
            'casts/pinCode/src/index.ts',
            'casts/promoNotice/src/index.ts',
            'casts/qrCodeScannerSheet/src/index.ts',
            'casts/rows/src/index.ts',
            'casts/splitNavigator/src/index.ts',
            'casts/stackNavigator/src/index.ts',
            'casts/texts/src/index.ts',

            'stories/browser/src/index.ts',
            'stories/chats/src/index.ts',
            'stories/stickers/src/index.ts',

            'packages/components/src/index.js',
            'packages/core/src/index.js',
            'packages/navigation_legacy/src/index.js',
        ];
        const tree = await parseDependencyTree(sources, {
            extensions: [
                '.ts',
                '.tsx',
                '.js',
                '.jsx',
                '.native.ts',
                '.native.tsx',
                '.native.js',
                '.native.jsx',
                '.web.ts',
                '.web.tsx',
                '.web.js',
                '.web.jsx',
                '.ios.ts',
                '.ios.tsx',
                '.ios.js',
                '.ios.jsx',
                '.android.ts',
                '.android.tsx',
                '.android.js',
                '.android.jsx',
                '.mjs',
                '.json',
            ],
        });
        const circulars = parseCircular(tree);
        if (circulars.length > 0) {
            console.log(
                '\x1b[33m%s\x1b[0m', // yellow
                `Circular dependencies were found by "DPDM" (${circulars.length}):\n`,
                prettyCircular(circulars),
            );
            process.exit(1);
        } else {
            console.info(
                '\x1b[32m%s\x1b[0m', // green
                'Congratulations! "DPDM" haven\'t found any circular dependencies in your code!',
            );
        }

        console.log('Testing for circular dependencies using "Madge"...');
        const res = await madge(path.join(__dirname, '..'), {
            fileExtensions: ['js', 'jsx', 'ts', 'tsx'],
        });
        const dependencies = res.circular() || [];
        if (dependencies.length > 0) {
            console.log(
                '\x1b[33m%s\x1b[0m', // yellow
                `Circular dependencies were found by "Madge" (${dependencies.length}):\n`,
                dependencies,
            );
            process.exit(1);
        } else {
            console.info(
                '\x1b[32m%s\x1b[0m', // green
                'Congratulations! "Madge" haven\'t found any circular dependencies in your code!',
            );
        }
    } catch (error) {
        console.error(
            '\x1b[31m%s\x1b[0m', // red
            'Failed to find circular dependencies with error:',
            error,
        );
        process.exit(1);
    }
};

checkCircularDependencies();
