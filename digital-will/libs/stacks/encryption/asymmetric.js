import { getUserData } from '../auth/auth';
import { encryptECIES, decryptECIES } from '@stacks/encryption';

export async function encrypt(chunk, RecieverPublicKey) {

	// Encrypt string with public key 
	const cipher = await encryptECIES(RecieverPublicKey, Buffer.from(chunk), true);

	return cipher;
}

export async function decrypt(cipher) {

	const privKey = getUserData().appPrivateKey;

	// Decrypt the cipher with private key to get the message
	const decipheredMessage = await decryptECIES(privKey, cipher)

	return decipheredMessage;
}