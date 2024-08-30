import {Injectable} from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class HashService {
  private secretKey = '9HzIUBvSINilRZtDoo1zdJndmDDcwsVv';

  encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, this.secretKey).toString();
  }

  decrypt(encryptedValue: string): string {
    return CryptoJS.AES.decrypt(encryptedValue, this.secretKey).toString(CryptoJS.enc.Utf8);
  }
}
