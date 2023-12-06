import { BlobServiceClient } from "@azure/storage-blob";

const sharedAccessSignature =
  process.env.NEXT_PUBLIC_AZURE_SHARED_ACCESS_SIGNATURE!;
const endpoint = process.env.NEXT_PUBLIC_AZURE_STORAGE_CONNECTION_STRING!;

const blobServiceClient = new BlobServiceClient(
  endpoint + sharedAccessSignature
);

export const listContainers = async () => {
  let i = 1;
  let containers = blobServiceClient.listContainers();
  for await (const container of containers) {
    console.log(`Container ${i++}: ${container.name}`);
  }
};

export const uploadBlob = async (file: File) => {
  const file_key =
    "uploads/" + Date.now().toString() + file.name.replace(" ", "-");
  const containerClient = blobServiceClient.getContainerClient(
    process.env.NEXT_PUBLIC_AZURE_CONTAINER_NAME!
  );
  const blobClient = containerClient.getBlockBlobClient(file_key);
  const uploadBlobResponse = await blobClient.uploadData(file);
  console.log(`Upload block blob ${file_key} successfully`);
  console.log(uploadBlobResponse);
  return {
    file_key,
    file_name: file.name,
  };
};

export const getBlobUrl = (file_key: string) => {
  return `${endpoint}/${process.env
    .NEXT_PUBLIC_AZURE_CONTAINER_NAME!}/${file_key}`;
};
