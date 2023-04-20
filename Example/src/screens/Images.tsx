import * as React from 'react';
import { View, Image } from 'react-native';

import { UIBoxButton } from '@tonlabs/uikit.controls';
import { UIAssets } from '@tonlabs/uikit.assets';
import { DuplicateImage, UILightbox } from '@tonlabs/uikit.media';
import { ExampleScreen } from '../components/ExampleScreen';

const imageUrl = {
    original:
        'https://firebasestorage.googleapis.com/v0/b/ton-uikit-example-7e797.appspot.com/o/loon-image-original.jpeg?alt=media&token=8907ad38-4d43-47c1-8f80-fd272e617440',
    medium: 'https://firebasestorage.googleapis.com/v0/b/ton-uikit-example-7e797.appspot.com/o/loon-image-medium.jpeg?alt=media&token=8a2f5747-495e-4aae-a9d0-460f34b12717',
    small: 'https://firebasestorage.googleapis.com/v0/b/ton-uikit-example-7e797.appspot.com/o/loon-image-small.jpeg?alt=media&token=022bc391-19ec-4e7f-94c6-66349f2e212e',
};

function DuplicateImageCheck() {
    const imageRef = React.useRef<Image>(null);
    const [showDuplicate, setShowDuplicate] = React.useState(true);
    const image = (
        <Image
            ref={imageRef}
            source={UIAssets.icons.logo.tonlabsPrimary}
            style={{ width: 50, height: 50 }}
        />
    );
    return (
        <View style={{ width: '100%', padding: 16, borderWidth: 1, alignItems: 'center' }}>
            <UILightbox
                image={{ uri: imageUrl.original }}
                preview={{ uri: imageUrl.medium }}
                prompt="Awesome picture"
                maxWidth={400}
                isLoading={!showDuplicate}
            />
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

export function Images() {
    return (
        <ExampleScreen>
            <DuplicateImageCheck />
        </ExampleScreen>
    );
}
