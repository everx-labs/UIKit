import * as React from 'react';
import { View } from 'react-native';

import { UILinkButton } from '@tonlabs/uikit.hydrogen';
import {
    UINotice,
    UINoticeType,
    UINoticeColor,
    UINoticeDuration,
} from '@tonlabs/uikit.navigation';
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

export const Notifications = () => {
    const [visibleBottomToastNotice, setVisibleBottomToastNotice] =
        React.useState<boolean>(false);
    const [visibleTopToastNotice, setVisibleTopToastNotice] =
        React.useState<boolean>(false);
    return (
        <ExampleScreen>
            <ExampleSection title="UINotice">
                <View
                    style={{
                        maxWidth: 350,
                        paddingVertical: 20,
                        alignItems: 'flex-start',
                    }}
                >
                    <UILinkButton
                        testID="show_BottomToast_uiNotice"
                        title={`${
                            visibleBottomToastNotice ? 'Hide' : 'Show'
                        } BottomToast notice`}
                        onPress={() =>
                            setVisibleBottomToastNotice(
                                !visibleBottomToastNotice,
                            )
                        }
                    />
                    <UILinkButton
                        testID="show_TopToast_uiNotice"
                        title={`${
                            visibleTopToastNotice
                                ? 'Hide'
                                : 'Show'
                        } TopToast notice`}
                        onPress={() => setVisibleTopToastNotice(!visibleTopToastNotice)}
                    />

                    <UINotice
                        type={UINoticeType.BottomToast}
                        title="System is going down at midnight tonight. We’ll notify you when it’s back up."
                        visible={visibleBottomToastNotice}
                        onClose={() => {
                            setVisibleBottomToastNotice(false);
                        }}
                        onTap={() => {
                            setVisibleBottomToastNotice(false);
                        }}
                        duration={UINoticeDuration.Short}
                        color={UINoticeColor.PrimaryInverted}
                    />
                    <UINotice
                        type={UINoticeType.TopToast}
                        title="System is going down at midnight tonight. We’ll notify you when it’s back up."
                        visible={visibleTopToastNotice}
                        onClose={() => {
                            setVisibleTopToastNotice(false);
                        }}
                        onTap={() => {
                            setVisibleTopToastNotice(false);
                        }}
                        duration={UINoticeDuration.Short}
                        color={UINoticeColor.PrimaryInverted}
                    />
                </View>
            </ExampleSection>
        </ExampleScreen>
    );
};
