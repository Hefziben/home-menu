import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { Platform, ModalController, LoadingController, IonContent, IonSlides, NavParams } from '@ionic/angular';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { Storage } from "@ionic/storage";
import { ApiService } from "../api.service";
import { DomSanitizer } from '@angular/platform-browser';
import { MapModalPage } from "../map-modal/map-modal.page";
declare var google;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild("map", { static: false }) mapElement: ElementRef;
  @ViewChild(IonContent, { static: false }) content: IonContent;
  @ViewChild("mySlider", { static: false }) spaceSlider: IonSlides;
  slideOpts = {
    initialSlide: 0,
    speed: 500,
    width:380,
    spaceBetween: 5,
    loop:true,
    centeredSlides: true,
    
     slidesPerView: 2,
  };

  urlCounter = 0;
  profesionalsInfo = false;
  employersInfo = false;
  landlordsInfo = false;
  developersInfo = false;
  brokersInfo = false;
  saved:Boolean;
  map: any;
  userLocation;
  userCity;
  lat = 1.284521;
lng = 103.851323;
   location;
  latLngResult;
  userLocationFromLatLng;
  coords;
  locationFilter;
  autocomplete: { input: string };
  autocompleteItems: any[];
  GoogleAutocomplete: any;
  placeid: any;
  activeInfoWindow;
  activeMarker = {title:'', open:''};
  markerCounter = 0;
  demandMarkers = [];
  infoWindows = [];
  active;
  loadData = true;

  amanities = [
    {
      icon: "../../assets/amenities/icons_internet.png",
      name: "High-speed Internet",
    },
    {
      icon: "../../assets/amenities/icons_meeting room.png",
      name: "Meeting rooms",
    },
    {
      icon: "../../assets/amenities/icons_phone booth.png",
      name: "Private phone booths",
    },
    {
      icon: "../../assets/amenities/icons_drinks and snacks.png",
      name: "Drinks & snacks",
    },
    {
      icon: "../../assets/amenities/icons_lounge area.png",
      name: "Lounge area",
    },
    {
      icon: "../../assets/amenities/icons_cleaning service.png",
      name: "Cleaning service",
    },
    {
      icon: "../../assets/amenities/icons_printing.png",
      name: "Business class printing",
    },
    {
      icon: "../../assets/amenities/icons_video conferencing.png",
      name: "Video conferencing",
    },
  ];
  spaces =[
    {
      title:'Secure videoconferencing',
      desc:'Soundproof videoconferencing suites with professional audio and lighting for private meetings and presentations',
      image:'../assets/spaces/videoconferencing.png'
    },
     {
      title:'High Speed Internet',
      desc:'High-speed commercial internet and networking equipment for streaming and conferencing',
      image:'../assets/spaces/High Speed Internet.jpeg'
    },
    {
      title:'Business class office facilities',
      desc:'Professional high-speed printing, shredding and office supplies',
      image:'../assets/spaces/Business class office facilities.png'
    },
    {
      title:'Ergonomically designed',
      desc:'Ergonomically designed chairs and desks for extended working sessions',
      image:'../assets/spaces/Ergonomically designed.jpeg'
    },
    {
      title:'Formal and informal workspaces',
      desc:'Beautifully designed workspaces with options of dedicated desks, open plan seating, meeting rooms and informal lounge areas',
      image:'../assets/spaces/Formal and informal workspaces.jpeg'
    },
  ]
  articles = [
    {
      title:'Working from Home and Your Health ',
      image:'./assets/blog/Working from home and your health.jpg',    
      desc:"At the start of the COVID-19 pandemic, many of us were overjoyed with the idea of working from home."
    },
    {
      title:'Reconfiguring our cities',
      image:'./assets/blog/Reconfiguring our cities.jpg',
      desc:"Modern cities have traditionally been the big hubs of business and activity. Now, the looming"
      },
    {
      title:'Reimagining work',
      image:'./assets/blog/Reimagining work.jpg',
      desc:"How will work evolve in a post-pandemic world? COVID-19 has challenged many of our norms,"
    },
    {
      title:'Return to the neighborhood',
      image:'./assets/blog/Return to the neighborhood.jpg',
      desc:"The coronavirus arrived at the world’s doorstep like an uninvited guest. As it overstays its welcome,"
    },
    {
      title:'5 Completely serious reasons to go back to commuting to work',
      image:'./assets/blog/Killing the commute.jpg',
      desc:"Thanks to COVID-19, we are all — willingly or unwillingly — participants in the longest trial run "
    },
  ];
  locations = [];
  user;
  engagedLocations = [];
  verification = false;
  counter = 0;
  currentPosition;
  selectedSpace = 1;
  selectedArticle = 1;
  currentSlide = 0;
  pin_selected = {
    url: "../../assets/images/location pin.png",
    scaledSize: { width: 40, height: 40 },
  };
  pin_unselected = {
    url: "../../assets/images/pin_unselected.svg",
    scaledSize: { width: 40, height: 40 },
  };
  positiion_pin = {
    url: "../../assets/images/user_location.svg",
    scaledSize: { width: 40, height: 40 },
  };
  position_pin = {
    url: "../../assets/images/position.svg",
    scaledSize: { width: 40, height: 40 },
  };
  not_open_pin = {
    url: "../../assets/images/not_open_pin.png",
    scaledSize: { width: 40, height: 40 },
  };
  spacesArray = [];
  articlesArray = [];
  video;
  videoPlayer: any;
  segment;
  disregard = false;
  slideConfig = {"slidesToShow": 1, "slidesToScroll": 1, "infinite":false, "centerMode":true, "initialSlide":1};
  showBtn: boolean = false;
  deferredPrompt;
  constructor(
    private loader: LoadingController,
    private api: ApiService,
    public platform: Platform,
    public zone: NgZone,
    private modal: ModalController,
    private router: Router,
    private route: ActivatedRoute,
    private storage: Storage,
    private domSanitizer: DomSanitizer,
    private navParams:NavParams,
    private plt:Platform
  ) {
    
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: "" };
    this.autocompleteItems = [];
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.user = this.router.getCurrentNavigation().extras.state.user;
        this.segment = this.router.getCurrentNavigation().extras.state.page;
        console.log(this.segment);
        
        if (this.user && this.loadData) {
          this.verification = true;
                           
        } else {
          //this.router.navigate(["login"]);
        }
      } else {
        this.storage.get("credentials").then((user) => {
          if (user && this.loadData) {
            this.verification = true;
            this.user = user;
            } else {
            //this.router.navigate(["login"]);
          }
        });
      }
    });
  }

  ngOnInit() {
    this.video = this.domSanitizer.bypassSecurityTrustResourceUrl("../../assets/video/video.mp4");
  }

  getval(e){
    console.log(e);
    
  }

  slickInit(e) {
   console.log('slick initialized');
 }

 afterChange(e) {
  console.log('afterChange',e.currentSlide);
  this.selectedSpace = e.currentSlide
  console.log(this.selectedSpace);
  if (this.selectedSpace == this.spacesArray.length - 2) {
    for (const item of this.spaces) {
      this.spacesArray.push(item)
      console.log('added', this.spacesArray.length);
      console.log(this.selectedSpace);
      
    }
  }
  
}
blogChange(e) {
  console.log('blogChange',e.currentSlide);
  this.selectedArticle = e.currentSlide
  console.log(this.selectedArticle);
  if (this.selectedArticle == this.articlesArray.length - 2) {
    for (const item of this.articles) {
      this.articlesArray.push(item)
      console.log('added', this.articlesArray.length);
      console.log(this.selectedArticle);
      
    }
  }
  
}

ionViewWillLeave(){
  console.log('will leave');
 }


 show(){
   this.showBtn = true;
 }
 hide(){
   this.showBtn = false;
 }
ionViewWillEnter(){
  if (this.plt.is('android')) {
    setTimeout(() => {
      this.showBtn = true;
    }, 3000);
  
    let current = 0;
    this.content.ionScroll.subscribe(scrollEvent =>{
      current = scrollEvent.detail.currentY;
         
      if (current >= 100 && this.showBtn) {
        this.hide();
      } else if (current < 100 && !this.showBtn && !this.disregard) {
        this.show();
      }
      
    })    
      
  }

 
   window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later on the button event.
    this.deferredPrompt = e;
    
     
  // Update UI by showing a button to notify the user they can add to home screen
    this.showBtn = true;
  });
   
  //button click event to show the promt
           
  window.addEventListener('appinstalled', (event) => {
    console.log(event);
    
   console.log('installed');
  });
   
   
  if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('display-mode is standalone');
  }
  
  var self = this;
  this.locations = []; 
 for (const space of this.spaces) {
   this.spacesArray.push(space)
 }

 for (let i = 0; i < 2; i++) {
  for (const article of this.articles) {
    this.articlesArray.push(article)
  }
 }
 

  if(this.segment == 2){
    var titleELe = document.getElementById('vision');
    this.content.scrollToPoint(0, titleELe.offsetTop);
  }   
    
  var day = new Date().getDay();
  var time = new Date().toLocaleTimeString().split(' ')[0];
  var a = time.split(':'); 
  var minutes = (+a[0]) * 60 + (+a[1]);

  this.storage.get('selection').then( res =>{
    if (res) {
      if(res.time >= minutes && res.day == day){
        console.log('returning with selection: ', res);
        this.saved = true;
        var data = res.selection;
        console.log(data);
        
        this.lat = data.lat;
        this.lng = data.lng;
        console.log(this.lat, this.lng); 
        this.getEngaged();
        
      } else{
        this.saved = false;
        console.log('opt 1');
        
        this.getEngaged();

      }


    } else {
      this.saved = false;
      console.log('opt 2');
      this.getEngaged();
        
    }

  });  
}

close(){
  this.showBtn = false;
  this.disregard = true;
}
add_to_home(e){
  debugger
  // hide our user interface that shows our button
  // Show the prompt
   this.deferredPrompt.prompt();
  // Wait for the user to respond to the prompt
  this.deferredPrompt.userChoice
    .then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the prompt');
        this.showBtn = false;
      } else {
        console.log('User dismissed the prompt');
        this.showBtn = false;
      }
      this.deferredPrompt = null;
      this.disregard = true;
    });
};
getEngaged() {
  console.log('getting offices');
  
  this.api.apiGetRequest('offices').then((res) => {
    console.log('step 1');
    const offices = res.data  
    console.log(offices);
    var counter = 0;
    for (const item of offices) {
      if (item.public) {
        counter++
      var location: any = {};
      if(item.properties){
        location.area = item.properties["area1"];
        location.lat = Number(item.properties["latitude"]);
        location.lng = Number(item.properties["longitude"])
      }
      location.name = item.name;
      location.id = item._id;
      location.dist = "0";
      location.isOpen = item.isOpen;
      location.image = `https:${item.image}`;
      console.log(counter,location);
      
      this.locations.push(location);
    }
  }
  console.log('step 2');
  console.log(this.locations); 
  
 
  }).then(()=>{
    console.log('step 3');
    
    if(this.saved){
      this.addMap(this.lat, this.lng);
  
    } else{
    this.getUserLocation();
    }
  })
}

addMap(lat, lng) {
       
  let latLng = new google.maps.LatLng(lat, lng);
  console.log(latLng);

  let mapOptions = {
    center: latLng,
    zoom: 13,
    gestureHandling: "cooperative",
    mapTypeControl: false,
    streetViewControl: false,
    disableDoubleClickZoom: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  };
  this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  this.map.addListener("dblclick", (event) => {
    this.activeInfoWindow.close();
    console.log("new marker", event["latLng"].lat(), event["latLng"].lng());
    this.lat = event["latLng"].lat();
    this.lng = event["latLng"].lng();
    if (this.activeInfoWindow) {
      this.activeInfoWindow.close();
      if(this.activeMarker){
        for (const marker of this.demandMarkers) {
          if (marker.title == this.activeMarker) {
            marker.setIcon(this.pin_unselected);
          }
        }
      }
    }
    this.addMaker(this.lat, this.lng);
    
  });
  this.addMaker(this.lat, this.lng);
 
}
addMaker(lat: number, lng: number) {
  if(this.currentPosition){
    this.currentPosition.setMap(null);
  }
  
  this.currentPosition = new google.maps.Marker({
    position: { lat, lng },
    icon:this.positiion_pin
  });
  //this.currentPosition.setMap(this.map);
  const center = new google.maps.LatLng(lat, lng);
  this.map.panTo(center);
  this.getGeoData();
}

getGeoData() {
  
  console.log('here');      
  for (let i = 0; i < this.demandMarkers.length; i++) {
    const element = this.demandMarkers[i];
    element.setMap(null);        
  }
  this.demandMarkers = [];


  this.locationFilter = null;
  console.log("latlong:", this.lat, this.lng);

  for (let i = 0; i < this.locations.length; i++) {
    this.locations[i].dist = "0";
    var R = 6371.0710; // Radius of the Earth in miles
    var rlat1 = this.lat * (Math.PI / 180); // Convert degrees to radians
    var rlat2 = this.locations[i].lat * (Math.PI / 180); // Convert degrees to radians
    var difflat = rlat2 - rlat1; // Radian difference (latitudes)
    var difflon = (this.locations[i].lng - this.lng) * (Math.PI / 180); // Radian difference (longitudes)

    var d =
      2 *
      R *
      Math.asin(
        Math.sqrt(
          Math.sin(difflat / 2) * Math.sin(difflat / 2) +
            Math.cos(rlat1) *
              Math.cos(rlat2) *
              Math.sin(difflon / 2) *
              Math.sin(difflon / 2)
        )
      );
      
    this.locations[i].dist = Number(d.toFixed(2));
  }
  let latlng;
  this.locationFilter = this.locations.sort(
    this.compareValues("dist", "asc")
  );
  let location;
  if (!this.saved) {
    console.log(this.saved);
    
    for (let i = 0; i < this.locations.length; i++) {
       
      if (this.locations[i].name == "Great World CIty") {
        location = this.locations[i];
        this.locations.splice(i,1)
        console.log(this.locations);
       }
      
    }
  }
  if (!this.saved) {
    this.locationFilter.unshift(location)
    this.saved = true;    
  }

  console.log(this.locationFilter);
  console.log(this.locations);
  
  this.active = 0;
  latlng = new google.maps.LatLng(
      this.locationFilter[0].lat,
      this.locationFilter[0].lng
    );
  this.map.panTo(latlng);
  this.getMarkers();
  

}

compareValues(key, order = "asc") {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      return 0;
    }

    const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
    const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return order === "desc" ? comparison * -1 : comparison;
  };
}

getMarkers() {
  this.infoWindows = [];
  this.demandMarkers = [];
  console.log(this.locationFilter);
  
  for (const data of this.locationFilter) {
    this.addMarkersToMap(data);
  }
  console.log(this.active);
  if (this.demandMarkers[this.active].label.text == 'open') {
  this.demandMarkers[this.active].setIcon(this.pin_selected);    
  } else{
  this.demandMarkers[this.active].setIcon(this.not_open_pin);
  }
  this.infoWindows[this.active].open(this.map, this.demandMarkers[this.active]);
  this.activeInfoWindow = this.infoWindows[this.active];
  this.activeMarker.title = this.demandMarkers[this.active].title;
  this.activeMarker.open = this.demandMarkers[this.active].label.text;

}
addMarkersToMap(location) {
  let information;
  let officeMarker;
  var self = this;
  if (location.isOpen) {
    information = new google.maps.InfoWindow({
      content:
  '<div style="display:flex;flex-direction:column;min-height:130px;justifycontent:center;align-items:center;background:#00AB84"><img id="image" style="width:155px;height:100px;border-radius:10px 10px 0 0;object-fit:cover" src=' +
        location.image +'><p style="font-size:12px;margin: 7px;padding: 1px;color: white;font-weight: 500;width:100%;text-align:center">'+ location.name +' - '+ location.dist + ' m away</p></div>',
    });
  } else{
    information = new google.maps.InfoWindow({
      content:
  '<div style="display:flex;flex-direction:column;min-height:130px;justifycontent:center;align-items:center;background:#5A5A5A"><img id="image" style="width:155px;height:100px;border-radius:10px 10px 0 0;object-fit:cover" src=' +
        location.image +'><p style="font-size:12px;margin: 7px;padding: 1px;color: white;font-weight: 500;width:100%;text-align:center">'+ location.name +' - '+ location.dist + ' m away</p></div>',
    });
  }
  
  // information.addListener("domready", () => {
  //   var imageBtn = document.getElementById("image");

  //   imageBtn.addEventListener("click", () => {
  //     if (this.urlCounter == 0) {
  //       this.urlCounter = 1;
  //       this.imageModal(location);
  //     }
  //   });
  // });
  this.infoWindows.push(information);
  const position = new google.maps.LatLng(location.lat, location.lng);
  if (location.isOpen) {
    
    officeMarker = new google.maps.Marker({
      position,
      title: location.name,
      label:{text:'open', fontSize:"0"},
      icon:this.pin_unselected
    });      
  } else{
    console.log(location.isOpen);      
    officeMarker = new google.maps.Marker({
      position,
      title: location.name,
      label:{text:'not open', fontSize:"0"},
      icon:this.position_pin
    });
  }
  officeMarker.addListener("click", function () {
    if (self.activeInfoWindow) {
      self.activeInfoWindow.close();
               for (const marker of self.demandMarkers) {
                if (marker.title == self.activeMarker.title && self.activeMarker.open == 'open') {
                          
                  marker.setIcon(self.pin_unselected);
                }
                if (marker.title == self.activeMarker.title && self.activeMarker.open == 'not open') {
                                
                  marker.setIcon(self.position_pin);
                }
        }
      
      

    } 
            
    self.demandMarkers[self.active].setIcon(self.pin_unselected);

    if (officeMarker.label.text == 'open') {
      console.log('open');
      
      officeMarker.setIcon(self.pin_selected); 
    } else{
      console.log('not open');
     
      officeMarker.setIcon(self.not_open_pin); 
    
    }


    information.open(this.map, officeMarker);
    self.activeInfoWindow = information;
    self.activeMarker.title = officeMarker.title;
    self.activeMarker.open = officeMarker.label.text;
    self.lat = officeMarker.position.lat();
    self.lng = officeMarker.position.lng();
    
    //self.getGeoData();

  });
  this.demandMarkers.push(officeMarker);
  officeMarker.setMap(this.map);

}

getUserLocation() {
  Plugins.Geolocation.getCurrentPosition()
    .then((resp) => {
      this.coords = resp.coords;
      console.log(this.coords);

      this.zone.run(() => {
        this.lat = resp.coords.latitude;
        this.lng = resp.coords.longitude;
        console.log(this.lat, this.lng);
        this.addMap(this.lat, this.lng);
      });
    })
    .catch((error) => {
      console.log(error);
      
      this.addMap(this.lat, this.lng);
    });
}
showInfo(value) {
  if (value == "profesionals") {
    this.employersInfo = false;
    this.brokersInfo = false;
    this.landlordsInfo = false;
    this.developersInfo = false;
    if (this.profesionalsInfo) {
      this.profesionalsInfo = false;
      this.employersInfo = false;
    } else {
      this.profesionalsInfo = true;
    }
  }
  if (value == "employers") {
    this.profesionalsInfo = false;
    this.brokersInfo = false;
    this.landlordsInfo = false;
    this.developersInfo = false;
    if (this.employersInfo) {
      this.employersInfo = false;
    } else {
      this.employersInfo = true;
    }
  }
  if (value == "landlords") {
    this.profesionalsInfo = false;
    this.developersInfo = false;
    this.brokersInfo = false;
    this.employersInfo = false;
    if (this.landlordsInfo) {
      this.landlordsInfo = false;
    } else {
      this.landlordsInfo = true;
    }
  }
  if (value == "developers") {
    this.profesionalsInfo = false;
    this.landlordsInfo = false;
    this.employersInfo = false;
    if (this.developersInfo) {
      this.developersInfo = false;
    } else {
      this.developersInfo = true;
    }
  }
}

top(){
  this.content.scrollToTop(1500)
}
reserve(type) {
  let navigation: NavigationExtras = {
    state: {
      occupation:type
    },
  };
  this.router.navigate(["register"], navigation);
}

goToBlog(article){
  let navigation:NavigationExtras ={
    state:{
      article:article
    }
  }
  this.router.navigate(['blog'], navigation);
}
  //got to nearby
  viewDetails(i){
    var time = new Date().toLocaleTimeString().split(' ')[0];
   var a = time.split(':'); 
   var minutes = (+a[0]) * 60 + (+a[1]);
  console.log(minutes);
   var data = {selection:'', time:0, day:0}; 
   data.selection = this.locationFilter[i];
   data.time = minutes + 60;
   data.day = new Date().getDay();
   console.log(data);
   
   
   this.storage.set('selection',data).then( data =>{
     console.log('leaving with selection: ', data);
     let navigation: NavigationExtras = {
       state:{
         page:'home'
       }
     }
     this.router.navigate(['nearby'],navigation);
   });
  }

  changeMarker(location, i) {
    this.demandMarkers[this.active].setIcon(this.pin_unselected);
    this.demandMarkers[this.active].setMap(this.map);
    this.active = i;
    if (this.activeInfoWindow) {
      this.activeInfoWindow.close();
      for (const marker of this.demandMarkers) {
          if (marker.title == this.activeMarker) {
            marker.setIcon(this.pin_unselected);
          }
        }
      
    }
    const center = new google.maps.LatLng(location.lat, location.lng);
    this.map.panTo(center);
    this.demandMarkers[i].setIcon(this.pin_selected);
    this.infoWindows[i].open(this.map, this.demandMarkers[i]);
    this.activeInfoWindow = this.infoWindows[i];
      }
//end
}
