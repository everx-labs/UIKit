const madge = require('madge');
const path = require('path');

const checkCircularDependencies = async () => {
    try {
        const res = await madge(path.join(__dirname, '..'));
        const dependencies = res.circular() || [];
        if (dependencies.length > 0) {
            console.log(
                '\x1b[33m', // yellow
                `Circular dependencies were found (${dependencies.length}):\n`, dependencies,
            );
            process.exit(1);
        } else {
            console.info(
                '\x1b[34m', // blue
                'Congratulations! Your code doesn\'t have any circular dependencies!',
            );
        }
    } catch (error) {
        console.error(
            '\x1b[31m', // red
            'Failed to find circular dependencies with error:', error,
        );
    }
};

checkCircularDependencies();
