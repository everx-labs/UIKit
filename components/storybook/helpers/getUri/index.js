// hack for images (couldn't set up proper img loader for storybook)
// should use react-native-web-loader or url-loader, but they break images
// so, use incorrect webpack-image-loader and convert paths manually...

const getUri = (source, width = 24, height = 24) => {
    return { uri: source, width, height };
};

export { getUri };
