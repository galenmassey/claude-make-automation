export interface MPCConfig {
  numShares: number;
  threshold: number;
}

export interface Share {
  index: number;
  value: string;
}

export interface EncryptedMessage {
  ciphertext: string;
  nonce: string;
}