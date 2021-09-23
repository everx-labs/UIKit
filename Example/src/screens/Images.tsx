import * as React from 'react';
import { View, Image } from 'react-native';

import { UIActionImage } from '@tonlabs/uikit.components';
import { UIBoxButton } from '@tonlabs/uikit.controls';
import { UIAssets } from '@tonlabs/uikit.assets';
import { DuplicateImage } from '@tonlabs/uistory.chats';
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

function DuplicateImageCheck() {
    const imageRef = React.useRef<Image>(null);
    const [showDuplicate, setShowDuplicate] = React.useState(false);
    const image = (
        <Image
            ref={imageRef}
            source={UIAssets.icons.logo.tonlabsPrimary}
            style={{ width: 50, height: 50 }}
        />
    );
    return (
        <View style={{ width: '100%', height: 500 }}>
            {image}
            <UIBoxButton
                testID="uiBoxButton_primary_default"
                title={showDuplicate ? 'Visible' : 'Not visible'}
                onPress={() => {
                    setShowDuplicate(!showDuplicate);
                }}
            />
            {showDuplicate && (
                <DuplicateImage source={imageRef} style={{ width: 50, height: 50 }}>
                    {image}
                </DuplicateImage>
            )}
        </View>
    );
}

export const Images = () => (
    <ExampleScreen>
        <ExampleSection title="UIActionImage">
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIActionImage
                    testID="uiActionImage_default"
                    iconEnabled={UIAssets.icons.ui.keyThinDark}
                    iconDisabled={UIAssets.icons.ui.keyThinGrey}
                    iconHovered={UIAssets.icons.ui.keyThinWhite}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIActionImage
                    testID="uiActionImage_disabled"
                    iconEnabled={UIAssets.icons.ui.keyThinDark}
                    iconDisabled={UIAssets.icons.ui.keyThinGrey}
                    iconHovered={UIAssets.icons.ui.keyThinWhite}
                    disabled
                />
            </View>
        </ExampleSection>
        <DuplicateImageCheck />
    </ExampleScreen>
);
