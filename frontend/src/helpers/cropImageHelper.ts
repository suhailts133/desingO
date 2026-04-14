export interface CroppedAreaPixels {
    x: number;
    y: number;
    width: number;
    height: number;
}

export async function getCroppedImage(imageSrc: string, croppedAreaPixels: CroppedAreaPixels, outputType: "image/jpeg" | "image/png" = "image/jpeg", quality = 0.9): Promise<Blob> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) return reject(new Error("Canvas is empty"));
                resolve(blob);
            },
            outputType,
            quality
        );
    });
}

function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.addEventListener("load", () => resolve(img));
        img.addEventListener("error", reject);
        img.setAttribute("crossOrigin", "anonymous");
        img.src = url;
    });
}