import * as React from 'react';
import { View } from 'react-native';
import { useTheme } from '../Colors';
import { makeStyles } from '../makeStyles';
import { Portal } from '../Portal';

// eslint-disable-next-line no-shadow
export enum UINoticeType {
    Toast = 'toast',
    Top = 'top',
    Bottom = 'bottom',
}
export type UINoticeProps = {
    type: UINoticeType;
    visible: boolean;
    onClose?: () => void;
    testID?: string;
};

export const UINotice: React.FC<UINoticeProps> = () => {
    const theme = useTheme();
    const styles = useStyles(theme);
    return (
        <Portal absoluteFill>
            <View style={styles.container} />
        </Portal>
    );
};

const useStyles = makeStyles(() => ({
    container: {},
}));
