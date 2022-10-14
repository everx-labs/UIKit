import type BigNumber from 'bignumber.js';

export type UISendSheetParams = {
    /**
     * External action title.
     */
    actionTitle: string;
    /**
     * Recipient's address string of Send external action.
     */
    address: string;
    /**
     * Amount of Send external action.
     */
    amount: BigNumber;
    /**
     * Send comment text
     */
    comment?: string;
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
