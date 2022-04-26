import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private platform: Platform) {
    this.platform.ready().then(() => {
      this.initializeApp();
    });
  }

  initializeApp(){
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      if(prefersDark.matches){
        document.body.classList.toggle('dark');
      }
  }
}
