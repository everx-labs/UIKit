export default function getSearchParameters() {
    let prmstr = window?.location.href.split('?');
    if (prmstr.length < 2) return {};
    prmstr = prmstr[1];
    return prmstr != null && prmstr != '' ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray(prmstr) {
    const params = {};
    const prmarr = prmstr.split('&');
    for (let i = 0; i < prmarr.length; i++) {
        const tmparr = prmarr[i].split('=');
        params[tmparr[0]] = tmparr[1] === 'true' ? true : tmparr[1] === 'false' ? false : tmparr[1];
    }
    return params;
}
