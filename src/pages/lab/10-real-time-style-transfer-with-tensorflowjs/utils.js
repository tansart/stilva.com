export function pGetImage(src) {
  return new Promise(resolve => {
    const image = new Image;
    image.src = src;
    image.onload = () => {
        resolve(image);
    }
  });
}

const dataImageCanvas = document.createElement('canvas');
const dataImageCtx = dataImageCanvas.getContext('2d');

export async function toDataImage(src) {
  const img = await pGetImage(src);
  dataImageCanvas.width = img.width;
  dataImageCanvas.height = img.height;
  dataImageCtx.drawImage(img, 0, 0, 224, 224);
  return dataImageCtx.getImageData(0, 0, 224, 224);
}
