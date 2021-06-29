import * as React from 'react';

export const useScreenshotRef = (
    value: string,
    getPng?: (base64: string) => void, // returns base64
    logoProp?: number,
): React.MutableRefObject<null> => {
    const ref = React.useRef<null>(null);

    const canvas = document.createElement('canvas');
    // get canvas context for drawing on canvas
    const context: CanvasRenderingContext2D | null = canvas.getContext('2d');
    // set canvas size
    const size = 200;
    canvas.width = size;
    canvas.height = size;
    // create image in memory(not in DOM)
    const image = new Image();
    const logo = new Image();
    // save function
    const download = (canv: HTMLCanvasElement) => {
        // snapshot canvas as png
        const pngBase64 = canv.toDataURL('image/png').split(';base64,')[1];
        if (getPng) {
            getPng(pngBase64);
        }
    };
    // later when image loads run this
    image.onload = () => {
        // clear canvas
        context?.clearRect(0, 0, size, size);
        // draw image with SVG data to canvas
        context?.drawImage(image, 0, 0, size, size);
        const logoSource = logoProp;
        console.log('logoSource', logoSource);
        if (logoSource) {
            // logo image
            // @ts-ignore
            logo.src = logoSource;
        } else {
            download(canvas);
        }
    };
    logo.onload = () => {
        const logoSize = 40;
        const logoStart = size / 2 - logoSize / 2;
        context?.drawImage(logo, logoStart, logoStart, logoSize, logoSize);
        // console.log({
        //     logo, logoStart, logoSize
        // })
        download(canvas);
    };

    setTimeout(() => {
        const element = document.getElementById(`uri-qr-${value}`)?.children[0];
        if (!element) {
            return;
        }
        const s = new XMLSerializer().serializeToString(element);
        const encodedData = window.btoa(s);
        const svgUrl = `data:image/svg+xml;base64,${encodedData}`;

        console.log('element', element);
        // start loading SVG data into in memory image
        // console.log('svgUrl', svgUrl)
        image.src = svgUrl;
    });

    return ref;
};
