import {Injectable} from '@angular/core';
import {AnyObject} from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class LocalizationProviderService {
  localizedStringMap: AnyObject = {};

  setLocalizedStrings(stringMap: AnyObject) {
    if (stringMap && Object.keys(stringMap).length > 0) {
      this.localizedStringMap = stringMap;
    }
  }

  getLocalizedString(key: any) {
    return this.localizedStringMap[key];
  }

  getLocalizedStringMap(): AnyObject {
    return this.localizedStringMap;
  }
}
