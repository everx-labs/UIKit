module.exports = function (api) {
    api.cache(true);

    const presets = [
      'react-native',
      '@babel/preset-flow'
    ];
    const plugins =  [];
  
    return {
      presets,
      plugins
    };
  }