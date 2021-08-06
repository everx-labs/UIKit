const madge = require('madge');
const path = require('path');
const { parseDependencyTree, parseCircular, prettyCircular } = require('dpdm');

const checkCircularDependencies = async () => {
    try {
        console.log('Testing for circular dependencies using "DPDM"...');
        const tree = await parseDependencyTree('index.js', { /* default options */ });
        const circulars = parseCircular(tree);
        if (circulars.length > 0) {
            console.log(
                '\x1b[33m%s\x1b[0m', // yellow
                `Circular dependencies were found by "DPDM" (${circulars.length})[TODO: fix them!!!]:\n`,
                prettyCircular(circulars),
            );
            // process.exit(1); Uncomment once ready!!!
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
            'Failed to find circular dependencies with error:', error,
        );
        process.exit(1);
    }
};

checkCircularDependencies();
