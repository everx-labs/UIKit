// hack for images (couldn't set up proper img loader for storybook)
// should use react-native-web-loader or url-loader, but they break images
// so, use incorrect webpack-image-loader and convert paths manually...

const getUri = (source, width = null, height = null) => {
    return { uri: source, width: width || 24, height: height || 24 };
};

export { getUri };
