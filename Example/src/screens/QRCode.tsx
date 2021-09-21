import React from 'react';
import { Image, View } from 'react-native';
import { UIBoxButton, UITextView } from '@tonlabs/uikit.hydrogen';
import { useTheme } from '@tonlabs/uikit.themes';
import { UIQRCodeView, QRCodeType, QRCodeRef, QRCodeSize } from '@tonlabs/uikit.flask';
import { createStackNavigator } from '@tonlabs/uikit.navigation';
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const logo = require('../../assets/icons/ico-crystal/crystal-fill-L.png');

const QRCode = () => {
    const theme = useTheme();
    const [base64Image, setBase64Image] = React.useState<string>('');
    const [type, setType] = React.useState<QRCodeType>(QRCodeType.Circle);
    const [size, setSize] = React.useState<QRCodeSize>(QRCodeSize.Large);
    const ref = React.useRef<QRCodeRef>(null);
    const onGetPng = () => {
        ref.current?.getPng().then((base64: string | null) => {
            if (base64) {
                setBase64Image(base64);
            }
        });
    };
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
                        onPress={() => setType(QRCodeType.Square)}
                        disabled={type === QRCodeType.Square}
                    />
                    <UIBoxButton
                        title="Circle"
                        onPress={() => setType(QRCodeType.Circle)}
                        disabled={type === QRCodeType.Circle}
                    />
                </View>
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: 200,
                    }}
                >
                    <UIBoxButton
                        title="Large"
                        onPress={() => setSize(QRCodeSize.Large)}
                        disabled={size === QRCodeSize.Large}
                    />
                    <UIBoxButton
                        title="Medium"
                        onPress={() => setSize(QRCodeSize.Medium)}
                        disabled={size === QRCodeSize.Medium}
                    />
                </View>
                <View
                    style={{
                        padding: 32,
                        backgroundColor: theme.BackgroundNeutral,
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <UIQRCodeView
                        type={type}
                        size={size}
                        value="QR code value QR value QR QR code value QR value QR QR code value QR value QR QR code value QR value QR "
                        logo={logo}
                        ref={ref}
                    />

                    <View style={{ paddingVertical: 20 }}>
                        <UIBoxButton title="getPng" onPress={onGetPng} />
                    </View>
                    {base64Image ? (
                        <View
                            style={{
                                width: '100%',
                                alignItems: 'center',
                            }}
                        >
                            <UITextView
                                style={{
                                    width: '100%',
                                    alignItems: 'center',
                                    paddingVertical: 8,
                                    textAlign: 'center',
                                }}
                                value="Image from getPng by ref:"
                            />
                            <Image
                                style={{
                                    height: 250,
                                    width: 250,
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
