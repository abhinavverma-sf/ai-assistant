import {Pipe, PipeTransform} from '@angular/core';
import {LocalizationProviderService} from '../services/localization-provider.service';

@Pipe({
  name: 'translate',
})
export class LocalizationPipe implements PipeTransform {
  constructor(private readonly localizationSvc: LocalizationProviderService) {}

  transform(key: any): string {
    return this.localizationSvc.getLocalizedString(key);
  }
}
