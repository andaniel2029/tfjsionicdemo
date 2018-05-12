import {Component, ViewChild} from '@angular/core';
import {App, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

@Component({
  templateUrl: 'app.html',
  queries: {
    nav: new ViewChild('content')
  }
})
export class MyApp {
  rootPage: any = 'TfpretrainedversionPage';
  public user: any;
  public nav: any;
  public counter = 0;
  public app: App;

  public pages = [
    {
      title: 'HOME',
      icon: 'ios-home-outline',
      component: 'HomePage'
    },
    {
      title: 'MOBILENET',
      icon: 'ios-information-circle-outline',
      component: 'MobilenetPage'
    },
    {
      title: 'LOGOUT',
      icon: 'ios-exit-outline',
      component: 'Login'
    },
  ];

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }
}

