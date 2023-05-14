export class ArrayDownloader {
    static download(array, mimeType, downloadName) {
        const blob = new Blob([array], { type: mimeType });	
        const objectUrl = URL.createObjectURL(blob);

        const anchor = document.createElement("a");
        anchor.href = objectUrl;
        anchor.download = downloadName;
        anchor.click();
    }
}