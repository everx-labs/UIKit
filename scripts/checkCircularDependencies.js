const madge = require('madge');
const path = require('path');
const { parseDependencyTree, parseCircular, prettyCircular } = require('dpdm');

const checkCircularDependencies = async () => {
    try {
        console.log('Testing for circular dependencies using "DPDM"...');
        const sources = [
            'index.js',
            'Example/index.js',
            'kit/assets/src/index.ts',
            'packages/browser/src/index.ts',
            'packages/charts/src/index.ts',
            'packages/chats/src/index.ts',
            'packages/components/src/index.js',
            'packages/core/src/index.js',
            'packages/flask/src/index.ts',
            'packages/hydrogen/src/index.ts',
            'packages/keyboard/src/index.ts',
            'packages/legacy/src/index.js',
            'packages/localization/src/index.ts',
            'packages/navigation/src/index.ts',
            'packages/navigation_legacy/src/index.js',
            'packages/popups/src/index.js',
            'packages/stickers/src/index.ts',
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
