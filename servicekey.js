const fs = require("fs");

// read the json file
const serviceAccount = JSON.parse(
  fs.readFileSync("./service.json", "utf8")
);

// extract values
const privateKey = serviceAccount.private_key;
const clientEmail = serviceAccount.client_email;
const projectId = serviceAccount.project_id;

console.log("Project ID:", projectId);
console.log("Client Email:", clientEmail);
console.log("Private Key:", privateKey);