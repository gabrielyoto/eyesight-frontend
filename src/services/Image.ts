export const getBlob = (fileUri: string) =>
  fetch(fileUri)
    .then((response) => response.blob())
    .catch((err) => console.error('erro convertendo uri', err));

export const convertBlobToBase64 = (
  blob: Blob
): Promise<string | ArrayBuffer> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
