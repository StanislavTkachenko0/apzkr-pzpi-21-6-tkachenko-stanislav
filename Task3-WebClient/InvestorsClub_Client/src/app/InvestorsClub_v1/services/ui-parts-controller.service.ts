import { Injectable } from '@angular/core';

@Injectable()
export class UIPartsController {

  get mobileQuery(): boolean {
    return window.innerWidth < 767;
  }

  constructor() {
  }

  storeValue() {
    return { ...this };
  }

  restoreValue(val: UIPartsController) {
  }
}
