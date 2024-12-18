import * as nacl from 'tweetnacl';
import { encodeBase64, decodeBase64 } from 'tweetnacl-util';
import secureRandom from 'secure-random';
import BN from 'bn.js';
import { GaloisField } from './GaloisField';
import { MPCConfig, Share, EncryptedMessage } from '../types';

export class MPCProtocol {
    private field: GaloisField;
    private keyPair: nacl.BoxKeyPair;

    constructor() {
        this.field = new GaloisField();
        this.keyPair = nacl.box.keyPair();
    }

    generateShares(secret: string, config: MPCConfig): Share[] {
        const secretBytes = Buffer.from(secret);
        const coefficients: BN[] = [new BN(secretBytes)];
        
        // Generate random coefficients for the polynomial
        for (let i = 1; i < config.threshold; i++) {
            coefficients.push(new BN(secureRandom(32)));
        }

        const shares: Share[] = [];
        
        // Generate shares using polynomial evaluation
        for (let x = 1; x <= config.numShares; x++) {
            let y = coefficients[0].clone();
            const xBN = new BN(x);
            
            for (let i = 1; i < coefficients.length; i++) {
                const term = this.field.multiply(
                    coefficients[i],
                    this.field.exp(xBN, new BN(i))
                );
                y = this.field.add(y, term);
            }
            
            shares.push({
                index: x,
                value: encodeBase64(y.toBuffer())
            });
        }

        return shares;
    }

    encryptShare(share: Share): EncryptedMessage {
        const nonce = nacl.randomBytes(24);
        const messageBytes = Buffer.from(JSON.stringify(share));
        
        const encrypted = nacl.secretbox(
            messageBytes,
            nonce,
            this.keyPair.secretKey
        );

        return {
            ciphertext: encodeBase64(encrypted),
            nonce: encodeBase64(nonce)
        };
    }

    decryptShare(encrypted: EncryptedMessage): Share {
        const ciphertext = decodeBase64(encrypted.ciphertext);
        const nonce = decodeBase64(encrypted.nonce);
        
        const decrypted = nacl.secretbox.open(
            ciphertext,
            nonce,
            this.keyPair.secretKey
        );

        if (!decrypted) {
            throw new Error('Failed to decrypt share');
        }

        return JSON.parse(Buffer.from(decrypted).toString());
    }
}