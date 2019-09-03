const markdowns = {
    '../../../components/menus/UICustomSheet/Readme.md': require('../../../menus/UICustomSheet/Readme.md'),
};

const getMarkdown = (path) => {
    return markdowns[path] || null;
};

export { getMarkdown };
