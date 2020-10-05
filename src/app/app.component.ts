import { Component, OnInit } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Router, NavigationExtras } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SwUpdate } from '@angular/service-worker';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages = [
    {
      title: "Home",
      url: "/home",
      icon: "../assets/menu/home-outline.svg",
    },    
    {
      title: "Nearby",
      url: "/nearby",
      icon: "../assets/menu/location-outline.svg",
    },
    {
      title: "About us",
      url: "/home",
      icon: "../assets/menu/information-circle-outline.svg",
    },
    {
      title: "Blog",
      url: "/home",
      icon: "../assets/menu/newspaper-outline.svg",
    },
    {
      title: "Sign in",
      url: "",
      icon: "../assets/menu/log-in-outline.svg",
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router:Router,
    private iab:InAppBrowser,
    public updates:SwUpdate
  ) {
   this.updates.available.subscribe(event => {
      console.log('current version is', event.current);
      console.log('available version is', event.available);
    });
    this.updates.activated.subscribe(event => {
      console.log('old version was', event.previous);
      console.log('new version is', event.current);
    });

    this.updates.available.subscribe(event => {
      console.log('update', event);
      
        this.updates.activateUpdate().then(() => this.updateApp());
    });
   }

   updateApp(){
    document.location.reload();
    console.log("The app is updating right now");
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString("00AB84")
      this.splashScreen.hide();
    });
  }

  ngOnInit() {

    const path = window.location.pathname;    
     console.log(path);
     this.selectedIndex = 0;
     if (path == '/home') {
       this.selectedIndex = 0;
     }
     if (path == '/nearby') {
       this.selectedIndex = 1;
     }
     if (path == '/about-us') {
       this.selectedIndex = 2;
     }
     if (path == '/blog') {
       this.selectedIndex = 3;
     }
 
 
     
   }
  
   
   goToPage(page, i){
     console.log(i);
     
     this.selectedIndex = i;
     var route;
     const path = window.location.pathname;
     console.log(path, i);
     
 //home redirection
 if(path == '/home' && i == 1 || path == '/blog' && i == 1){
   route = 'nearby';
   this.router.navigate([route]);
 }
 if(path == '/home' && i == 2){
   route = 'about-us';
   let navigate: NavigationExtras = {
     state:{
       page:i
     }
   }
 this.router.navigate([route], navigate);
 }
 if(path == '/home' && i == 3){
   route = 'blog';
   this.router.navigate([route]);
 }
 if(path == '/home' && i == 4){
   route = 'signin';
   this.iab.create(`https://my.hoodwork.co/login`)
 }
 //nearby redirection
     
     if(path == '/nearby' && i == 0 || path == '/blog' && i == 0){
       route = '/home';
       let navigate: NavigationExtras = {
         state:{
           page:i
         }
       }
   this.router.navigate([route], navigate);
     }
     if(path == '/nearby' && i == 2 || path == '/blog' && i == 2){
       route = 'about-us';
       let navigate: NavigationExtras = {
         state:{
           page:i
         }
       }
   this.router.navigate([route], navigate);
     }
     if(path == '/nearby' && i == 3){
       route = 'blog';
       this.router.navigate([route]);
     }
     if(path == '/nearby' && i == 4 || path == '/blog' && i == 4){
       route = 'signin';
       this.iab.create(`https://my.hoodwork.co/login`)
     }
   
     //about us redirect
     if (path == '/about-us' && i == 0) {
       route = 'home';  
         let navigate: NavigationExtras = {
           state:{
             page:i
           }
         }
     this.router.navigate([route], navigate);
     
     }
     if(path == '/about-us' && i == 1){
       route = 'nearby';
       this.router.navigate([route]);
     }
     if(path == '/about-us' && i == 3){
       route = 'blog';
       this.router.navigate([route]);
     }
     
     if(path == '/about-us' && i == 4){
       route = 'signin';
       this.iab.create(`https://my.hoodwork.co/login`)
     }
   }
}
