// Import required modules
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const encryptor = require('file-encryptor');

// Define the folder to encrypt
const folderToEncrypt = 'x_folder';

// Define the function to ask for the encryption or decryption key
function askForDecryptionKey(operation, callback) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let promptMessage = '';
    if (operation === 'encrypt') {
        promptMessage = 'Enter the encryption key: ';
    } else if (operation === 'decrypt') {
        promptMessage = 'Enter the decryption key: ';
    } else {
        rl.close();
        throw new Error('Invalid operation');
    }

    rl.question(promptMessage, function(key) {
        rl.close();
        callback(key);
    });
}

// Encrypt files in the specified folder
function encryptFolder(folderPath, encryptionKey) {
    fs.readdir(folderPath, function(err, files) {
        if (err) throw err;

        files.forEach(function(file) {
            const filePath = path.join(folderPath, file);
            const encryptedFilePath = filePath + '.enc';

            encryptor.encryptFile(filePath, encryptedFilePath, encryptionKey, function(err) {
                if (err) throw err;
                console.log('File encrypted:', file);
                
                // Delete original file after encryption
                fs.unlink(filePath, function(err) {
                    if (err) throw err;
                    console.log('Original file deleted:', file);
                });
            });
        });
    });
}

// Decrypt files in the specified folder
function decryptFolder(folderPath, decryptionKey) {
    fs.readdir(folderPath, function(err, files) {
        if (err) throw err;

        files.forEach(function(file) {
            if (path.extname(file) === '.enc') {
                const filePath = path.join(folderPath, file);
                const decryptedFilePath = filePath.slice(0, -4); // Remove '.enc' extension

                encryptor.decryptFile(filePath, decryptedFilePath, decryptionKey, function(err) {
                    if (err) throw err;
                    console.log('File decrypted:', file);
                    
                    // Remove encrypted file after decryption
                    fs.unlink(filePath, function(err) {
                        if (err) throw err;
                        console.log('Encrypted file removed:', file);
                    });
                });
            }
        });
    });
}

// Check command line arguments
if (process.argv[2] === 'encrypt') {
    // Ask for encryption key and then encrypt
    askForDecryptionKey('encrypt', function(encryptionKey) {
        encryptFolder(folderToEncrypt, encryptionKey);
    });
} else if (process.argv[2] === 'decrypt') {
    // Ask for decryption key and then decrypt
    askForDecryptionKey('decrypt', function(decryptionKey) {
        decryptFolder(folderToEncrypt, decryptionKey);
    });
} else {
    console.log('Usage: node encrypt_decrypt.js [encrypt|decrypt]');
}
