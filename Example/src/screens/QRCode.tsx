import React from 'react';
import { Image, View } from 'react-native';
import { UIBoxButton, UITextView, useTheme, ColorVariants } from '@tonlabs/uikit.hydrogen';
import { UIQRCodeView, QRCodeType } from '@tonlabs/uikit.flask';
import { createStackNavigator } from '@tonlabs/uikit.navigation';
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const logo = require('../../assets/icons/ico-crystal/crystal-fill-L.png');

const QRCode = () => {
    const theme = useTheme();
    const [base64Image, setBase64Image] = React.useState<string>('');
    const [type, setType] = React.useState<QRCodeType>('Default');
    return (
        <ExampleScreen>
            <ExampleSection title="QRCode">
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: 200,
                    }}
                >
                    <UIBoxButton
                        title="Default"
                        onPress={() => setType('Default')}
                        disabled={type === 'Default'}
                    />
                    <UIBoxButton
                        title="Circle"
                        onPress={() => setType('Circle')}
                        disabled={type === 'Circle'}
                    />
                </View>
                <View
                    style={{
                        padding: 32,
                        backgroundColor: theme.BackgroundNeutral,
                        alignItems: 'center',
                    }}
                >
                    <UIQRCodeView
                        type={type}
                        value="QR code value QR value QR code value QR value QR code value QR value QR code value QR value QR code value QR "
                        size={200}
                        logo={logo}
                        logoMargin={2}
                        logoSize={40}
                        logoBackgroundColor={ColorVariants.BackgroundNegative}
                        getPng={(base64: string) => {
                            setBase64Image(`data:image/png;base64,${base64}`);
                        }}
                    />

                    {base64Image ? (
                        <View
                            style={{
                                marginVertical: 30,
                            }}
                        >
                            <View
                                style={{
                                    height: 40,
                                }}
                            >
                                <UITextView value="Image from getPng prop:" />
                            </View>
                            <Image
                                style={{
                                    height: 200,
                                    width: 200,
                                }}
                                source={{ uri: base64Image }}
                            />
                        </View>
                    ) : null}
                </View>
            </ExampleSection>
        </ExampleScreen>
    );
};

const QRCodeStack = createStackNavigator();

export const QRCodeScreen = () => {
    return (
        <QRCodeStack.Navigator>
            <QRCodeStack.Screen
                name="QRCodeWindow"
                options={{
                    useHeaderLargeTitle: true,
                    title: 'QR code',
                }}
                component={QRCode}
            />
        </QRCodeStack.Navigator>
    );
};
