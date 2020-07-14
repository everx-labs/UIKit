import icoArrowLeft from './ico-arrow-left/ico-arrow-left.png';
import icoPlus from './ico-plus/ico-plus.png';
import icoMastercard from './bank-cards/ico-mastercard/mastercard.png';
import icoVisa from './bank-cards/ico-visa/visa.png';
import icoMaestro from './bank-cards/ico-maestro/maestro.png';
import btnClose from './btn_close/btn_close.png';

// Security
import touchId from './touch-id/touch-id.png';
import faceId from './face-id/face-id.png';

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

    static get faceId() {
        return faceId;
    }

    static get touchId() {
        return touchId;
    }
}
