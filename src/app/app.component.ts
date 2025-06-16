import {
  AfterViewInit,
  Component,
  HostBinding,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { themes } from '@assets/themes';
import { ThemeService } from '@services/theme';
import { tap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'stockApp';

  @HostBinding('class') private _currentClass = '';

  myTemplate!: TemplateRef<any>;
  myTemplateBg!: TemplateRef<any>;

  imageIn: boolean = false;
  afterInit: boolean = false;
  imageMouse(event: boolean) {
    this.imageIn = event;
  }

  imageOutput(event: TemplateRef<any>) {
    // console.log('algo llega...-> ', event);
    this.myTemplate = event;
  }

  imageBgOutput(event: TemplateRef<any>) {
    // console.log('algo llega...-> ', event);
    this.myTemplateBg = event;
  }

  get currentClass(): string[] {
    return this._currentClass.split(/\s+/);
  }

  constructor(private _themeService: ThemeService) {}

  ngOnInit(): void {
    this._themeService.currentTheme
      .pipe(
        tap((currentTheme) => {
          // 2 only
          // const appClass: string[] = this.currentClass;
          // const isTheme: number = appClass.indexOf(currentTheme);
          // // if (currentTheme) appClass.push(currentTheme);
          // if (isTheme >= 0) {
          //   appClass.splice(isTheme, 1);
          //   this._currentClass = appClass.join(' ');
          // } else {
          //   appClass.splice(isTheme, 1);
          //   appClass.push(currentTheme);
          // }
          // this._currentClass = appClass.join(' ');
          // 3+
          const possibleThemes = themes;
          const appClass: string[] = this.currentClass;
          possibleThemes.forEach((element) => {
            const index: number = appClass.indexOf(element);
            if (index >= 0) appClass.splice(index, 1);
          });
          appClass.push(currentTheme);
          this._currentClass = appClass.join(' ');
          window.localStorage.setItem('theme', currentTheme);
        })
      )
      .subscribe();
    // const initTheme = window.localStorage.getItem('theme') || '';
    // if (
    //   initTheme === '' ||
    //   initTheme === 'dark-theme' ||
    //   initTheme === 'light-theme'
    // )
    //   this._themeService.newTheme(initTheme);
  }
  ngAfterViewInit(): void {
    this.afterInit = true;
  }

  themeChange() {
    const lightTheme: string = 'light-theme';
    const darkTheme: string = 'dark-theme';
    const appClass: string[] = this.currentClass;
    const isTheme: boolean = appClass.includes(lightTheme);
    this._themeService.newTheme(isTheme ? darkTheme : lightTheme);
  }

  doSome(event: MouseEvent, theme: string) {
    if (this._themeService.currentThemeName == theme) event.stopPropagation();
    this._themeService.newTheme(theme);
    return;
  }
}
