/* eslint-disable no-shadow, @typescript-eslint/no-shadow  */
// eslint-disable-next-line @typescript-eslint/no-var-requires, import/no-extraneous-dependencies
// const traverse = require('@babel/traverse').default;

const constsToInline = Object.create(null);

function getIdentifierID(node) {
    return node.name;
}

module.exports = function plugin({ types: t, traverse }) {
    return {
        name: 'babel-plugin-transform-inline-consts',
        visitor: {
            Program(path) {
                // On program start, do an explicit traversal before other plugins.
                path.traverse({
                    VariableDeclaration(path) {
                        if (path.node.kind !== 'const') {
                            return;
                        }

                        let hasInlineComment = false;
                        if (path.node.leadingComments != null) {
                            hasInlineComment = path.node.leadingComments.reduce(
                                (_acc, { value }) => {
                                    if (value.replace(/[^@a-zA-Z_-]/g, '') === '@inline') {
                                        return true;
                                    }
                                    return false;
                                },
                                false,
                            );
                        }
                        if (hasInlineComment) {
                            traverse(
                                path.node,
                                {
                                    VariableDeclarator(path) {
                                        constsToInline[getIdentifierID(path.node.id)] =
                                            path.node.init.value;
                                    },
                                },
                                path.scope,
                                path,
                            );
                        }
                    },
                    Identifier(path) {
                        try {
                            const inlinedValue = constsToInline[getIdentifierID(path.node)];
                            if (inlinedValue != null) {
                                path.replaceWith(t.valueToNode(inlinedValue));
                            }
                        } catch (err) {
                            // Do nothing
                        }
                    },
                });
            },
        },
    };
};
