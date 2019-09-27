const icoArrowLeft = require('./ico-arrow-left/ico-arrow-left.png');
const icoPlus = require('./ico-plus/ico-plus.png');
const icoMastercard = require('./bank-cards/ico-mastercard/mastercard.png');
const icoVisa = require('./bank-cards/ico-visa/visa.png');
const icoMaestro = require('./bank-cards/ico-maestro/maestro.png');
const btnClose = require('./btn_close/btn_close.png');

export default class UIAssets {
    // Icons
    static icoArrowLeft() {
        return icoArrowLeft;
    }

    static icoPlus() {
        return icoPlus;
    }

    // Buttons
    static btnClose() {
        return btnClose;
    }

    // bank
    static icoMastercard() {
        return icoMastercard;
    }

    static icoVisa() {
        return icoVisa;
    }

    static icoMaestro() {
        return icoMaestro;
    }
}
