/* eslint-disable no-shadow */
// eslint-disable-next-line @typescript-eslint/no-var-requires, import/no-extraneous-dependencies
// const traverse = require('@babel/traverse').default;

let inExpression = 0;
const constsToInline = Object.create(null);

function getIdentifierID(node) {
    return node.name;
}

module.exports = function plugin({ types: t, traverse }) {
    return {
        name: 'babel-plugin-transform-inline-consts',
        visitor: {
            VariableDeclaration(path) {
                if (path.node.kind !== 'const') {
                    return;
                }

                let hasInlineComment = false;
                if (path.node.leadingComments != null) {
                    hasInlineComment = path.node.leadingComments.reduce((_acc, { value }) => {
                        if (value.replace(/[^@a-zA-Z_-]/g, '') === '@inline') {
                            return true;
                        }
                        return false;
                    }, false);
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
            CallExpression: {
                enter() {
                    inExpression += 1;
                },
                exit() {
                    inExpression -= 1;
                },
            },
            AssignmentExpression: {
                enter() {
                    inExpression += 1;
                },
                exit() {
                    inExpression -= 1;
                },
            },
            Identifier(path) {
                if (inExpression === 0) {
                    return;
                }

                const inlinedValue = constsToInline[getIdentifierID(path.node)];
                if (inlinedValue != null) {
                    path.replaceWith(t.valueToNode(inlinedValue));
                }
            },
        },
    };
};
