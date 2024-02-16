//----------------------------------------------------------------------------------
// Microsoft Developer & Platform Evangelism
//
// Copyright (c) Microsoft Corporation. All rights reserved.
//
// THIS CODE AND INFORMATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, 
// EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES 
// OF MERCHANTABILITY AND/OR FITNESS FOR A PARTICULAR PURPOSE.
//----------------------------------------------------------------------------------
// The example companies, organizations, products, domain names,
// e-mail addresses, logos, people, places, and events depicted
// herein are fictitious.  No association with any real company,
// organization, product, domain name, email address, logo, person,
// places, or events is intended or should be inferred.
//----------------------------------------------------------------------------------

// <snippet_ImportLibrary>
// index.js
const { BlobServiceClient } = require("@azure/storage-blob");
// Now do something interesting with BlobServiceClient
// </snippet_ImportLibrary>

// <snippet_DeclareVariables>
const createContainerButton = document.getElementById("create-container-button");
const deleteContainerButton = document.getElementById("delete-container-button");
const selectButton = document.getElementById("select-button");
const fileInput = document.getElementById("file-input");
const listButton = document.getElementById("list-button");
const deleteButton = document.getElementById("delete-button");
const status = document.getElementById("status");
const fileTable = document.getElementById("file-table").getElementsByTagName('tbody')[0];

const reportStatus = message => {
    //status.innerHTML += `${message}<br/>`;
    //status.scrollTop = status.scrollHeight;
}
// </snippet_DeclareVariables>

// <snippet_StorageAcctInfo>
// Update <placeholder> with your Blob service SAS URL string
const blobSasUrl = "";
// </snippet_StorageAcctInfo>

// <snippet_CreateClientObjects>
// Create a new BlobServiceClient
const blobServiceClient = new BlobServiceClient(blobSasUrl);

// Create a unique name for the container by 
// appending the current time to the file name
const containerName = "container" + new Date().getTime();

// Get a container client from the BlobServiceClient
const containerClient = blobServiceClient.getContainerClient(containerName);
// </snippet_CreateClientObjects>

// <snippet_CreateDeleteContainer>
const createContainer = async () => {
    try {
        reportStatus(`Creating container "${containerName}"...`);
        await containerClient.create();
        reportStatus(`Done. URL:${containerClient.url}`);
    } catch (error) {
        reportStatus(error.message);
    }
};

const deleteContainer = async () => {
    try {
        reportStatus(`Deleting container "${containerName}"...`);
        await containerClient.delete();
        reportStatus(`Done.`);
    } catch (error) {
        reportStatus(error.message);
    }
};

createContainerButton.addEventListener("click", createContainer);
deleteContainerButton.addEventListener("click", deleteContainer);
// </snippet_CreateDeleteContainer>

// <snippet_ListBlobs>
const listFiles = async () => {
    while (fileTable.rows.length > 0) {
        fileTable.deleteRow(0);
    }

    try {
        reportStatus("Retrieving file list...");
        let iter = containerClient.listBlobsFlat();
        let blobItem = await iter.next();
        while (!blobItem.done) {
            let blobClient = containerClient.getBlockBlobClient(blobItem.value.name);
            let tags = await blobClient.getTags();
            let scanResults = null;
            for (const tag in tags.tags) {
                if (tag === 'Malware Scanning scan result') {
                    scanResults = tags.tags[tag];
                }
            }

            if (scanResults === 'Malicious') {
                var row = fileTable.insertRow(-1);
                row.className = "table-danger";
                row.innerHTML = `<td>${blobItem.value.name}</td><td>${blobItem.value.properties.lastModified}</td><td>${scanResults === null ? 'Scanning' : scanResults }</td>`;
            } else if (scanResults === 'No threats found') {
                var row = fileTable.insertRow(-1);
                row.className = "table-success";
                row.innerHTML = `<td>${blobItem.value.name}</td><td>${blobItem.value.properties.lastModified}</td><td>${scanResults === null ? 'Scanning' : scanResults }</td>`;
            } else {
                var row = fileTable.insertRow(-1);
                row.className = "table-secondary";
                row.innerHTML = `<td>${blobItem.value.name}</td><td>${blobItem.value.properties.lastModified}</td><td>${scanResults === null ? 'Scanning' : scanResults }</td>`;
            }
            blobItem = await iter.next();
        }
    } catch (error) {
        reportStatus(error.message);
    }
};

listButton.addEventListener("click", listFiles);
// </snippet_ListBlobs>

// <snippet_UploadBlobs>
const uploadFiles = async () => {
    try {
        reportStatus("Uploading files...");
        const promises = [];
        for (const file of fileInput.files) {
            const blockBlobClient = containerClient.getBlockBlobClient(file.name);
            promises.push(blockBlobClient.uploadBrowserData(file));
        }
        await Promise.all(promises);
        reportStatus("Done.");
        listFiles();
    }
    catch (error) {
            reportStatus(error.message);
    }
}

selectButton.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", uploadFiles);
// </snippet_UploadBlobs>

deleteButton.addEventListener("click", deleteFiles);
// </snippet_DeleteBlobs>