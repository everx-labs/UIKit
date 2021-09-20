import * as React from 'react';
import { UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.hydrogen';
import { DOTS_STATE_PRESENTATION_DURATION } from './constants';

// eslint-disable-next-line no-shadow
enum UIPinCodeDescriptionStatus {
    Regular,
    Valid,
    Invalid,
}

type UIPinCodeDescriptionProps = {
    description?: string;
    descriptionTestID?: string;
};

export type UIPinCodeDescriptionRef = {
    showValid: (description: string) => void;
    showError: (description: string) => void;
};

export const UIPinCodeDescription = React.forwardRef<
    UIPinCodeDescriptionRef,
    UIPinCodeDescriptionProps
>(function UIPinCodeDescriptionImpl(
    { description: descriptionProp = ' ', descriptionTestID }: UIPinCodeDescriptionProps,
    ref,
) {
    const [description, setDescription] = React.useState(descriptionProp);
    const [status, setStatus] = React.useState(UIPinCodeDescriptionStatus.Regular);

    React.useImperativeHandle(ref, () => ({
        showValid(validDescription) {
            if (!validDescription) {
                return;
            }
            setDescription(validDescription);
            setStatus(UIPinCodeDescriptionStatus.Valid);
            setTimeout(() => {
                setDescription(descriptionProp);
                setStatus(UIPinCodeDescriptionStatus.Regular);
            }, DOTS_STATE_PRESENTATION_DURATION);
        },
        showError(errorDescription) {
            if (!errorDescription) {
                return;
            }
            setDescription(errorDescription);
            setStatus(UIPinCodeDescriptionStatus.Invalid);
            setTimeout(() => {
                setDescription(descriptionProp);
                setStatus(UIPinCodeDescriptionStatus.Regular);
            }, DOTS_STATE_PRESENTATION_DURATION);
        },
    }));

    const color = React.useMemo(() => {
        if (status === UIPinCodeDescriptionStatus.Valid) {
            return UILabelColors.TextPositive;
        }

        if (status === UIPinCodeDescriptionStatus.Invalid) {
            return UILabelColors.TextNegative;
        }

        return UILabelColors.TextSecondary;
    }, [status]);

    return (
        <UILabel
            testID={descriptionTestID}
            numberOfLines={1}
            color={color}
            role={UILabelRoles.ParagraphFootnote}
            selectable={false}
        >
            {description}
        </UILabel>
    );
});
