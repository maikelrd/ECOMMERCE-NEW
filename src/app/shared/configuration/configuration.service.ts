import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Configuration } from './configuration';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  setting: Configuration = new Configuration();

  constructor() { }

  getSettings(): Observable<Configuration>{
    return of(this.setting);
  }
}
