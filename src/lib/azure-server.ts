import { BlobServiceClient } from "@azure/storage-blob";
import fs from "fs";

export async function downloadFromAzure(file_key: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const sharedAccessSignature =
        process.env.NEXT_PUBLIC_AZURE_SHARED_ACCESS_SIGNATURE!;
      const endpoint = process.env.NEXT_PUBLIC_AZURE_STORAGE_CONNECTION_STRING!;

      const blobServiceClient = new BlobServiceClient(
        endpoint + sharedAccessSignature
      );

      const containerClient = blobServiceClient.getContainerClient(
        process.env.NEXT_PUBLIC_AZURE_CONTAINER_NAME!
      );

      const blobClient = containerClient.getBlockBlobClient(file_key);

      const downloadBlockBlobResponse = await blobClient.download(0);

      const file_name = `/tmp/samragyi${Date.now().toString()}.pdf`;

      if (downloadBlockBlobResponse.readableStreamBody) {
        //open the writable stream and write the file
        const file = fs.createWriteStream(file_name);
        file.on("open", function (fd) {
          downloadBlockBlobResponse.readableStreamBody
            ?.pipe(file)
            .on("finish", () => {
              return resolve(file_name);
            });
        });
      }
    } catch (error) {
      console.error(error);
      reject(error);
      return null;
    }
  });
}
