jest.mock('react-native-safe-area', () => ({
    show: jest.fn(),
}));
jest.mock('@react-native-community/netinfo', () => {});
jest.mock('react-native-device-info', () => {
    return {
        getModel: jest.fn(),
        isTabletSync: jest.fn(),
        getApplicationNameSync: jest.fn(),
        getReadableVersionSync: jest.fn(),
        getModelSync: jest.fn(),
        getSystemVersionSync: jest.fn(),
    };
});
jest.mock('react-native-localization', () => class RNLocalization {
  language = 'en';

  constructor(props) {
      this.props = props;
      this.setLanguage(this.language);
      this.getLanguage();
  }

  setLanguage(interfaceLanguage) {
      this.language = interfaceLanguage;
      if (this.props[interfaceLanguage]) {
          const localizedStrings = this.props[this.language];
          for (const key in localizedStrings) {
              if (localizedStrings.hasOwnProperty(key)) this[key] = localizedStrings[key];
          }
      }
  }

  getLanguage() {
      return this.language;
  }
});
