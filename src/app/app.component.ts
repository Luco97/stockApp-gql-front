import { Component, HostBinding, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'stockApp';

  @HostBinding('class') theme = '';

  constructor() {}

  ngOnInit(): void {
    this.theme = window.localStorage.getItem('theme') || '';
  }

  themeChange() {
    if (this.theme.includes('my-light-theme'))
      this.theme = this.theme.replace('my-light-theme', '').trim();
    else {
      this.theme = this.theme.concat(' my-light-theme');
      window.localStorage.setItem('theme', 'my-light-theme');
    }
  }
}
