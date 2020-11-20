// @flow
import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View, Image } from 'react-native';

import type AnimatedValue from 'react-native/Libraries/Animated/src/nodes/AnimatedValue';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import {
    UIColor,
    UIConstant,
    UIStyle,
    UIFunction,
    UIColorPalette,
} from '@tonlabs/uikit.core';
import { UIAssets } from '@tonlabs/uikit.assets';
import { UIShareManager } from '@tonlabs/uikit.navigation';
import { UITextButton, UIActionComponent } from '@tonlabs/uikit.components';
import type { ActionProps } from '@tonlabs/uikit';
import { uiLocalized } from '@tonlabs/uikit.localization';

type Props = ActionProps & {
    style: ViewStyleProp,
    containerStyle: ViewStyleProp,
    progress: boolean,
    transparent: boolean,
    index: ?number,
    image: string,
    title: number | string,
    truncTitle: boolean,
    caption: string,
    truncCaption: boolean,
    details: string,
    truncDetails: string,
    titleComponent?: React$Node,
    captionComponent?: React$Node,
    customComponent?: React$Node,
    disableHighlight?: boolean,
    titleIsText?: boolean,
    copyTarget: ?string,
};

const styles = StyleSheet.create({
    rowContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    hoverOffset: {
        left: -UIConstant.contentOffset(),
        right: -UIConstant.contentOffset(),
        top: 0,
        bottom: 0,
    },
    avatar: {
        width: UIConstant.defaultCellHeight(),
        height: UIConstant.defaultCellHeight(),
        borderRadius: UIConstant.defaultCellHeight() / 2.0,
        overflow: 'hidden',
    },
});

export const UIDetailsButtonTestIds = {
    title: 'title',
    details: 'details',
    secondDetails: 'secondDetails',
    caption: 'caption',
};

export const UIDetailsButtonCopyTargets = {
    title: 'title',
    details: 'details',
};

const UIDetailsButton = forwardRef(({
                                        disabled = false,
                                        disableHighlight,
                                        titleIsText,
                                        titleComponent,
                                        captionComponent,
                                        secondDetails,
                                        customComponent,
                                        narrow = false,
                                        style = {},
                                        containerStyle = {},
                                        progress = false,
                                        index = null,
                                        image = '',
                                        title = '',
                                        truncTitle = false,
                                        caption = '',
                                        truncCaption = false,
                                        truncDetails = false,
                                        details = '',
                                        copyTarget = null,
                                        isTapped,
                                        isHover,
                                        onPress,
                                    }: Props, ref) => {
    const [spinValue, setSpinValue] = useState<AnimatedValue>(new Animated.Value(0));

    let mounted = false;

    // Getters
    const backgroundStyle = disabled || disableHighlight
        ? null
        : isHover || isTapped
            ? [
                UIColor.getBackgroundColorStyle(UIColor.whiteLight()),
                styles.hoverOffset,
            ] : null;

    const titleColorStyle = disabled || titleIsText
        ? UIColor.getColorStyle(UIColorPalette.text.lightSecondary)
        : isHover || isTapped
            ? UIColor.getColorStyle(UIColor.primary4())
            : null;

    // Actions
    const animateRotation = () => {
        Animated.timing(spinValue, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
        }).start(() => {
            if (mounted) {
                setSpinValue(new Animated.Value(0));
                animateRotation();
            }
        });
    };

    // Events
    const onPressCopy = useCallback(() => {
        const str = copyTarget === UIDetailsButtonCopyTargets.title ? title : details || '';
        UIShareManager.copyToClipboard(str, uiLocalized.CopiedToClipboard);
    }, [copyTarget, title, details]);

    // Render
    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const progressCardComponent = (
        <View style={UIStyle.common.alignCenter()}>
            <Animated.Image
                source={UIAssets.icons.ui.progress}
                style={{
                    transform: [{ rotate: spin }],
                }}
            />
        </View>
    );

    const copyButton = narrow || !isHover ? null : (
        <UITextButton
            title={uiLocalized.Copy}
            style={[UIStyle.height.tinyCell(), UIStyle.margin.leftDefault()]}
            textStyle={
                copyTarget === UIDetailsButtonCopyTargets.title
                    ? UIStyle.text.primaryBodyMedium()
                    : UIStyle.text.primarySmallMedium()}
            onPress={onPressCopy}
        />
    );

    const getFormattedText = (str: string) => UIFunction.truncText(str, narrow);
    const formattedCaption = truncCaption ? getFormattedText(caption) : caption;
    const captionText = !caption ? null : (
        <Text
            ellipsizeMode="middle"
            numberOfLines={1}
            style={UIStyle.text.primarySmallRegular()}
            testID={UIDetailsButtonTestIds.caption}
        >
            {formattedCaption}
        </Text>
    );
    const formattedTitle = truncTitle ? getFormattedText(title) : title;

    const titleCaptionComponent = (
        <View style={styles.rowContainer}>
            {!!formattedTitle && (
                narrow ? (
                    <UITextButton
                        testID={UIDetailsButtonTestIds.title}
                        style={UIStyle.height.smallCell()}
                        textStyle={[UIStyle.text.bodyMedium(), titleColorStyle]}
                        title={formattedTitle}
                        onPress={onPress}
                    />
                ) : (
                    <Text
                        testID={UIDetailsButtonTestIds.title}
                        ellipsizeMode="middle"
                        numberOfLines={1}
                        style={[
                            UIStyle.text.bodyMedium(),
                            UIStyle.flex.x1(),
                            UIStyle.margin.rightDefault(),
                            titleColorStyle,
                        ]}
                    >
                        {formattedTitle}
                        {copyTarget === UIDetailsButtonCopyTargets.title ? copyButton : null}
                    </Text>
                )
            )}
            {titleComponent}
            {!formattedTitle && !titleComponent && <View style={UIStyle.common.flex()} />}
            {captionText}
            {captionComponent}
        </View>
    );

    const detailsComponent = !!(details || secondDetails) && (
        <View style={[styles.rowContainer, UIStyle.margin.topTiny()]}>
            <Text
                style={[UIStyle.text.secondaryCaptionRegular(), UIStyle.flex.x1()]}
                testID={UIDetailsButtonTestIds.details}
            >
                {truncDetails ? getFormattedText(details) : details}
                {copyTarget === UIDetailsButtonCopyTargets.details ? copyButton : null}
            </Text>
            <Text
                style={UIStyle.text.secondaryCaptionRegular()}
                testID={UIDetailsButtonTestIds.secondDetails}
            >
                {secondDetails}
            </Text>
        </View>
    );

    const contentCardComponent = (
        <View style={[UIStyle.flex.x1(), UIStyle.flex.column()]}>
            {customComponent}
            {titleCaptionComponent}
            {detailsComponent}
        </View>
    );

    const margin = narrow ? UIStyle.margin.rightSmall() : UIStyle.margin.rightDefault();
    const renderCard = progress ? progressCardComponent : (
        <View style={UIStyle.container.centerLeft()}>
            {index !== null && (
                <Text style={[UIStyle.text.primarySmallMedium(), margin]}>
                    {index}.
                </Text>
            )}
            {!!image && (
                <Image
                    source={image}
                    style={[styles.avatar, margin]}
                />
            )}
            {contentCardComponent}
        </View>
    );

    const contentComponent = (
        <View
            style={[
                UIStyle.common.justifyCenter(),
                UIStyle.height.majorCell(),
                containerStyle,
                style,
            ]}
        >
            <View style={[UIStyle.common.positionAbsolute(), backgroundStyle]} />
            {renderCard}
        </View>
    );

    useEffect(() => {
        mounted = true;
        if (progress) {
            animateRotation();
        }
        return () => {
            mounted = false;
        };
    }, []);

    return contentComponent;
});

const UIComponentDetailsButton = (props: any) => {
    const actionProps = {
        ...props,
        onPress: props.narrow ? () => {} : props.onPress,
    };

    return (
        <UIActionComponent {...actionProps}>
            <UIDetailsButton {...props} />
        </UIActionComponent>
    );
};

export default UIComponentDetailsButton;
