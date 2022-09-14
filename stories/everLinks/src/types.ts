import type BigNumber from 'bignumber.js';

export type UIEverLinkSheetProps = {
    /**
     * Prop to control Ever Link sheets visibility.
     */
    visible: boolean;
    /**
     * A callback that is called when the sheet closes;
     *
     * Set `visible` prop to `false` within it.
     */
    onClose: () => void;
    /**
     * Params list for the corresponding type of Ever Link sheet.
     */
    params: UISendSheetParams;
};

export type UISendSheetParams = {
    /**
     * Recipient's address string of Send external action.
     */
    address: string;
    /**
     * Amount of Send external action.
     */
    amount: BigNumber;
    /**
     * Network fees amount of Send external action.
     */
    fee: BigNumber;
    /**
     * A callback that is fired on Send sheet's "Confirm" button.
     */
    onConfirm: () => void;
    /**
     * Currency sign of Send external action.
     */
    signChar: string;
};
