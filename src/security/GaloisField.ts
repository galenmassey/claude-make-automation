import BN from 'bn.js';

export class GaloisField {
    private prime: BN;
    
    constructor() {
        // Use a 256-bit prime for the field
        this.prime = new BN('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F', 'hex');
    }

    add(a: BN, b: BN): BN {
        return a.add(b).mod(this.prime);
    }

    multiply(a: BN, b: BN): BN {
        return a.mul(b).mod(this.prime);
    }

    exp(base: BN, exponent: BN): BN {
        return base.pow(exponent).mod(this.prime);
    }
}