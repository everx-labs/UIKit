import * as React from 'react';
import { ScrollView, Text, View } from 'react-native';

import { UIImageView } from '@tonlabs/uikit.navigation_legacy';
import { UIActionImage, UIImage } from '@tonlabs/uikit.components';
import { UIAssets } from '@tonlabs/uikit.assets';

export const Images = () => (
    <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
        <View
            style={{
                width: '96%',
                paddingLeft: 40,
                paddingBottom: 10,
                marginHorizontal: '2%',
                marginTop: 20,
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(0,0,0,.1)',
            }}
        >
            <Text>UIActionImage</Text>
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UIActionImage
                iconEnabled={UIAssets.icons.ui.keyThinDark}
                iconDisabled={UIAssets.icons.ui.keyThinGrey}
                iconHovered={UIAssets.icons.ui.keyThinWhite}
            />
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UIActionImage
                iconEnabled={UIAssets.icons.ui.keyThinDark}
                iconDisabled={UIAssets.icons.ui.keyThinGrey}
                iconHovered={UIAssets.icons.ui.keyThinWhite}
                disabled
            />
        </View>
        <View
            style={{
                width: '96%',
                paddingLeft: 40,
                paddingBottom: 10,
                marginHorizontal: '2%',
                marginTop: 20,
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(0,0,0,.1)',
            }}
        >
            <Text>UIImage</Text>
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            {/* $FlowFixMe */}
            <UIImage source={UIAssets.icons.ui.keyThinDark} />
        </View>
        <View
            style={{
                width: '96%',
                paddingLeft: 40,
                paddingBottom: 10,
                marginHorizontal: '2%',
                marginTop: 20,
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(0,0,0,.1)',
            }}
        >
            <Text>UIImageView Editable (press it)</Text>
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UIImageView
                photoStyle={{ width: 100, height: 100 }}
                source={UIAssets.icons.ui.keyThinDark}
                editable
            />
        </View>
        <View
            style={{
                width: '96%',
                paddingLeft: 40,
                paddingBottom: 10,
                marginHorizontal: '2%',
                marginTop: 20,
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(0,0,0,.1)',
            }}
        >
            <Text>UIImageView Fullscreen (press it)</Text>
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UIImageView
                photoStyle={{ width: 100, height: 100 }}
                sourceBig={UIAssets.icons.logo.tonlabsPrimary}
                source={UIAssets.icons.logo.tonlabsPrimary}
            />
        </View>
    </ScrollView>
);
