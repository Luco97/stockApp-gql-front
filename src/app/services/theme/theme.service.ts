import { Injectable } from '@angular/core';
import { themes } from '@assets/themes';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private _currentThemeName: string = '';
  private _currentTheme: BehaviorSubject<string>;

  constructor() {
    let initTheme = window.localStorage.getItem('theme') || '';
    if (!themes.includes(initTheme)) initTheme = 'dark-theme';
    this._currentTheme = new BehaviorSubject<string>(initTheme);
  }

  get currentTheme(): Observable<string> {
    return this._currentTheme.asObservable();
  }

  get currentThemeName(): string {
    return this._currentThemeName;
  }

  newTheme(themeClass: string) {
    this._currentTheme.next(themeClass);
    this._currentThemeName = themeClass;

    return;
  }
}
