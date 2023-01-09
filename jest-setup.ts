// @ts-ignore
// eslint-disable-next-line import/no-extraneous-dependencies
import mockClipboard from '@react-native-clipboard/clipboard/jest/clipboard-mock';
// @ts-ignore
// eslint-disable-next-line import/no-extraneous-dependencies
import mockDeviceInfo from 'react-native-device-info/jest/react-native-device-info-mock';

jest.mock('@react-native-clipboard/clipboard', () => mockClipboard);
jest.mock('react-native-device-info', () => mockDeviceInfo);
jest.mock(
    'react-native-localization',
    () =>
        class RNLocalization {
            language = 'en';

            props: any;

            constructor(props: any) {
                this.props = props;
                this.setLanguage(this.language);
                this.getLanguage();
            }

            setLanguage(interfaceLanguage: string) {
                this.language = interfaceLanguage;
                if (this.props[interfaceLanguage]) {
                    const localizedStrings = this.props[this.language];
                    Object.keys(localizedStrings).forEach((key: string) => {
                        // eslint-disable-next-line no-prototype-builtins
                        if (localizedStrings.hasOwnProperty(key)) {
                            // @ts-ignore
                            this[key] = localizedStrings[key];
                        }
                    });
                }
            }

            getLanguage() {
                return this.language;
            }
        },
);
