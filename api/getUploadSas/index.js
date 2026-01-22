const { BlobServiceClient } = require("@azure/storage-blob");
 
module.exports = async function (context, req) {
  const filename = req.query.filename;
 
  const blobServiceClient =
    BlobServiceClient.fromConnectionString(
      process.env.AzureWebJobsStorage
    );
 
  const containerClient =
    blobServiceClient.getContainerClient("uploads");
 
  const blobClient =
    containerClient.getBlockBlobClient(
      `${Date.now()}-${filename}`
    );
 
  const sasUrl = await blobClient.generateSasUrl({
    permissions: "cw",
    expiresOn: new Date(Date.now() + 5 * 60 * 1000)
  });
 
  context.res = {
    body: { uploadUrl: sasUrl }
  };
};
