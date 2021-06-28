import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@tonlabs/uikit.hydrogen';
// import { QRCodeView } from '@tonlabs/uikit.flask';
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';
import { createStackNavigator } from '@tonlabs/uikit.navigation';
import { UIQRCodeView } from '../../../packages/flask/src/UIQRCodeView';

const logo = require('../../assets/icons/ico-crystal/crystal-fill-L.png');

const QRCode = () => {
    const theme = useTheme();
    return (
        <ExampleScreen>
            <ExampleSection title="QRCode">
                <View
                    style={{
                        padding: 32,
                        backgroundColor: theme.BackgroundNeutral,
                        alignItems: 'center',
                    }}
                >
                    <UIQRCodeView
                        type="Default"
                        value="Cirlce QR code Cirlce QR Cirlce QR code Cirlce QR Cirlce QR code Cirlce QR Cirlce QR code Cirlce QR Cirlce QR code Cirlce QR "
                        size={200}
                        logo={logo}
                        logoMargin={4}
                        logoBackgroundColor="lightblue"
                        logoSize={60}
                        getPng={(base64: string) => {
                            console.log('base64', base64)
                        }}
                    />
                    <UIQRCodeView
                        type="Circle"
                        value="Cirlce QR code Cirlce QR Cirlce QR code Cirlce QR Cirlce QR code Cirlce QR Cirlce QR code Cirlce QR Cirlce QR code Cirlce QR "
                        size={200}
                        logo={logo}
                    />
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
