import { createSha2Hash } from '@stacks/encryption';
import { Buffer } from '@stacks/common';

let crypto = require('crypto'), encryptionAlgorithm = 'aes-256-ctr', hashAlgorithm = 'sha256';

export async function encryptData(chunk) {

	var cipher,
		result,
		iv;

	// Create an iv
	iv = crypto.randomBytes(16);

	// Key Generate using 
	const SHA_256 = await createSha2Hash();

	const KEY = await SHA_256.digest(Buffer.from(chunk), hashAlgorithm);

	// Create a new cipher
	cipher = crypto.createCipheriv(encryptionAlgorithm, KEY, iv);

	// Create the new chunk
	result = Buffer.concat([iv, KEY, cipher.update(chunk), cipher.final()]);

	return result;
}

export async function decryptData(chunk) {

	var decipher,
		result,
		iv;

	// Get the iv: the first 16 bytes
	iv = chunk.slice(0, 16);

	const KEY = chunk.slice(16, 48);

	// Get the rest
	chunk = chunk.slice(48);

	// Create a decipher
	decipher = crypto.createDecipheriv(encryptionAlgorithm, KEY, iv);

	// Actually decrypt it
	result = Buffer.concat([decipher.update(chunk), decipher.final()]);

	return result.toString('utf8');
}




