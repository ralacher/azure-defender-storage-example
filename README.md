# Instructions
1. Clone repository
2. Update line 41 with your own Azure Blob service SAS URL
3. `npm install`
4. `npm start`

# Testing
Copy and paste the below text into a text file. Upload the text file to the Azure Storage container. It will be flagged as malicious.  
`X5O!P%@AP[4\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*`  
[Upload an EICAR test file to simulate malware upload - Microsoft Learn](https://learn.microsoft.com/en-us/azure/defender-for-cloud/defender-for-storage-test#upload-an-eicar-test-file-to-simulate-malware-upload)

# References
- [Microsoft Authentication Library for JavaScript (MSAL)](https://github.com/AzureAD/microsoft-authentication-library-for-js). Use this to add Entra ID authentication. Your application can log in a user, acquire a SAS token or authenticate to Azure Storage on the user's behalf.  
- [Example for how to authentiate to Azure Storage in vanilla JavaScript](https://github.com/Azure-Samples/AzureStorageSnippets/tree/master/blobs/quickstarts/JavaScript/V12/azure-blobs-js-browser).
- [Labs for enabling and configuring Defender for Storage for malware scanning](https://github.com/Azure/Microsoft-Defender-for-Cloud/blob/main/Labs/Modules/Module%2019%20-%20Defender%20for%20Storage.md).
- [Defender for Storage documentation](https://learn.microsoft.com/en-us/azure/defender-for-cloud/defender-for-storage-introduction).

# Images
![Waiting for scan results](images/create-container.png?raw=true "Waiting for results")  
![Scan Results ready](images/get-results.png?raw=true "Scan results ready")
