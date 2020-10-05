import {
  Component,
  OnInit,
  NgZone,
  ViewChild,
  ElementRef,
  
} from "@angular/core";
import {
  NavController,
  ModalController,
  LoadingController,
  IonContent,
  Config, NavParams
} from "@ionic/angular";
//import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Plugins } from "@capacitor/core";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { ApiService } from "../api.service";
import { Storage } from "@ionic/storage";

import { MenuController } from '@ionic/angular';
import { RegisterPage } from "../register/register.page";
const { Share } = Plugins;




import Axios from 'axios';



declare var google;
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
@Component({
  selector: "app-map-modal",
  templateUrl: "./map-modal.page.html",
  styleUrls: ["./map-modal.page.scss"],
})
export class MapModalPage implements OnInit {
  @ViewChild("map", { static: false }) mapElement: ElementRef;
  @ViewChild("map2", { static: false }) mapElement2: ElementRef;
  @ViewChild("custom-frame", { static: false }) frameEl: ElementRef;
  @ViewChild(IonContent, { static: false }) content: IonContent;
  cards = [];
  showMap = false;
  map: any;
  map2: any;
  frame:any;
  userCity;
  lat = 1.284521;
  lng = 103.851323;
  latLngResult;
  autocomplete: { input: string };
  autocompleteItems: any[];
  GoogleAutocomplete: any;
  newLocation = false;
  mheight='0px'
  
  items: any;
  option: any;
  info;
  coords;
  results = 3;
  locationFilter;
  demandMarkers = [];
  infoWindows = [];
  activeInfoWindow;
  activeMarker = {title:'', open:''};
  active = 0;
  locations = [];
  counter = 0;
  currentPosition;
  engagedLocations;
  locationsEngaged = [];
  busStations: Array<any> = []; 
  mrtStations: Array<any> = []; 
  markerA;
  markerB;
  urlCounter = 0;
  open = false;
  plans = [];
  initial:Boolean;
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
  public selectedIndex = 0;
  public nearbyIndex = 0;
  public transportIndex = 0;
  
  directionsRenderer;
  directionsService = new google.maps.DirectionsService();
  

  segments = [
        {
      name:'Homes',
      id:0
    },
    {
      name:'MRT',
      id:1
    },
    {
      name:'Bus',
      id:2
    }
  ];
  segments_2 = [
    {
      name:'Homes',
      id:0
    },
    {
      name:'Transport',
      id:1
    }
  ];
  segments_3 = [
    {
      name:'Bus stop',
      id:0
    },
    {
      name:'MRT Station',
      id:1
    }
  ];
  pin_selected = {
    url: "../../assets/images/location pin.png",
    scaledSize: { width: 40, height: 40 },
  };
  pin_unselected = {
    url: "../../assets/images/pin_unselected.svg",
    scaledSize: { width: 40, height: 40 },
  };
  position_pin = {
    url: "../../assets/images/user_location.svg",
    scaledSize: { width: 40, height: 40 },
  };
  notOpen_pin = {
    url: "../../assets/images/position.svg",
    scaledSize: { width: 40, height: 40 },
  };
  not_open_pin = {
    url: "../../assets/images/not_open_pin.png",
    scaledSize: { width: 40, height: 40 },
  };
  start_pin = {
    url: "../../assets/images/home.svg",
    scaledSize: { width: 30, height: 30 },
  };
  end_pin = {
    url: "../../assets/images/greylogo.png",
    scaledSize: { width: 44, height: 34 },
  };
  swipeCount = 0;
  success = true;
  segment: string;
  segment2: string;
  segment3: string;
  nearCondos;
  property = 0;
  mrt = 0;
directions = {start:'', end:'', instructions:'',duration:''};
yyshare = {
  config: [{
        facebook: {
          socialShareUrl: 'https://peterpeterparker.io'
        }
      },{
        twitter: {
          socialShareUrl: 'https://peterpeterparker.io'
        }
  }]
};

modalPage = false;
page;
  constructor(
    private menu: MenuController,
    private storage: Storage,
    private api: ApiService,
    public zone: NgZone,
    private modal: ModalController,
    private modal2:ModalController,
    private router: Router,
    private loader: LoadingController,
    private route:ActivatedRoute,
    private iab:InAppBrowser,
    //private config:Config
    
  ) {
    //this.config.set('backButtonIcon', 'close');

    
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: "" };
    this.autocompleteItems = [];
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.page = this.router.getCurrentNavigation().extras.state.page;   
        console.log(this.page);
             
        
      }
    });

    
  }

  ngOnInit() {
    this.segment = "Homes"
    this.segment2 = "Homes"
    this.segment3 = 'Bus stop'    
  }
  
  closeModal(){
    this.modal.dismiss();
  }
ionViewWillLeave(){
  var time = new Date().toLocaleTimeString().split(' ')[0];
  var a = time.split(':'); 
  var minutes = (+a[0]) * 60 + (+a[1]);
console.log(minutes);
  var data = {selection:'', time:0, day:0}; 
  data.selection = this.locationFilter[this.active];
  data.time = minutes + 60;
  data.day = new Date().getDay();
  console.log(data);
  
  
  this.storage.set('selection',data).then( data =>{
    console.log('leaving with selection: ', data);
  });  
}
clear(){
  this.storage.remove('selection');
}


ionViewWillEnter(){
  console.log('entering');

  
  var day = new Date().getDay();
  var time = new Date().toLocaleTimeString().split(' ')[0];
  var a = time.split(':'); 
  var minutes = (+a[0]) * 60 + (+a[1]);
 
    this.storage.get('selection').then( res =>{
      if (res) {
        console.log('case 1');
            console.log(res.time, minutes);
        if(res.time >= minutes && res.day == day){
          console.log('returning with selection: ', res);
          this.initial = false;
          console.log(this.initial);
          var data = res.selection 
         this.lat = data.lat;
         this.lng = data.lng;
         this.addMap(this.lat, this.lng);
         this.addMaker(this.lat, this.lng);
        

        } else{
          console.log('case 2');
          this.initial = true;
          console.log(this.initial);
        
          
          this.getUserLocation();
          

        }

  
      } else {
        this.initial = true;
        
        console.log('case 3');
        
        console.log(this.initial);
        this.getUserLocation();
        
      }  
    }); 
     
}

getMemberships(){
  this.plans = [];
  this.presentLoading().then(()=>{
    this.api.apiGetRequest('plans').then(res=>{
      console.log(res);
      
      for (const item of res.data) {
        if(item.type == "hotdesk" || item.type == "desk"){
          for (const location of item.locations) {
            if(location == this.locationFilter[this.active].id){
             var data = {
               name:item.name,
               price:item.price,
               image:`https:${item.image}`,
               description:item.description,
               id:item._id
             }
             this.plans.push(data);
            }
          }

  
   
        }
        if(item.type == "service"){
         for (const location of item.locations) {
           
           if(location == this.locationFilter[this.active].id){
             console.log('match');
             
            var data = {
              name:item.name,
              price:item.price,
              image:`https:${item.image}`,
              description:item.description,
              id:item._id
            }
            this.plans.push(data);
  
   
           }
  
         }

       }
      }
      this.loader.dismiss()
   
   
      
    }) 

  })

       }
  segmentChanged(e){
 console.log(this.segment);    
if(this.segment == "MRT"){
  this.open = false;
  this.directionsRenderer.setMap(null);
  this.infoWindows[this.active].open(this.map, this.demandMarkers[this.active]);
  this.infoWindows[this.active].open(this.map2, this.demandMarkers[this.active]);
  console.log(this.segment);  
}
if(this.segment == "Bus"){
  this.directionsRenderer.setMap(null);
  this.infoWindows[this.active].open(this.map, this.demandMarkers[this.active]);
  this.infoWindows[this.active].open(this.map2, this.demandMarkers[this.active]);
  this.open = false;
  console.log(this.segment);  
}
  }

  changeCondo(i){
this.property = i;
console.log(i);

this.getDirections();
  }

  
placeService(type, radius){
  var spaceLat = this.locationFilter[this.active].lat;
  var spaceLng = this.locationFilter[this.active].lng;
    var service = new google.maps.places.PlacesService(this.map);
    let request = {
      location: { lat: spaceLat, lng: spaceLng },
        radius : radius,
        query: [type]
      };
    return new Promise((resolve,reject)=>{
        service.textSearch(request,function(results,status){
            if(status === google.maps.places.PlacesServiceStatus.OK)
            {
                resolve(results);    
            }else
            {
                reject(status);
            }

        }); 
    });

}

//"subway_station","train_station", "transit_station", "light_rail_station"]
calculateDistance(array,space,type){  
  console.log(type);
  
  for (let i = 0; i < array.length; i++) {
    array[i].dist = "0";
    var R = 6371.0710; // Radius of the Earth in miles
    var rlat1 = space.lat * (Math.PI / 180); // Convert degrees to radians
    var rlat2 = array[i].lat * (Math.PI / 180); // Convert degrees to radians
    var difflat = rlat2 - rlat1; // Radian difference (latitudes)
    var difflon = (array[i].lng - space.lng) * (Math.PI / 180); // Radian difference (longitudes)

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
     if (type == 0) {
      array[i].dist = Number((Number(d.toFixed(2))*1000).toFixed(0));
     } else{
      array[i].dist = Number(d.toFixed(2));
     }

  }
  
}

getBusStations(){
  this.busStations = []; 
  var type = "bus stop";
  var radius = 1000
  
  this.placeService(type, radius).then((results : Array<any>)=>{
    console.log(results);
    
    for (const stop of results) {  

      this.busStations.push({
        name:stop.name,
        lat:stop.geometry.location.lat(),
        lng:stop.geometry.location.lng(),
        dist:''
      });
    }
    this.calculateDistance(this.busStations,this.locationFilter[this.active],0);
    console.log(this.busStations);
    
},(status)=>console.log(status));
}
getMrtStations(){
  this.mrtStations = [];
  var type = "subway station";
  var radius = 500;
  this.placeService(type, radius).then((results : Array<any>)=>{   
    console.log(results);
     
    for (const mrt of results) {      
      this.mrtStations.push({
        name:mrt.name,
        lat:mrt.geometry.location.lat(),
        lng:mrt.geometry.location.lng(),
        dist:''
      });
    }
    this.calculateDistance(this.mrtStations,this.locationFilter[this.active],1);
       
},(status)=>console.log(status));
}



  
  getDirections(){
  var spaceLat = this.locationFilter[this.active].lat;
  var spaceLng = this.locationFilter[this.active].lng;
  var condoLat = this.nearCondos[this.property].latitude;
  var condoLng = this.nearCondos[this.property].longitude;
  console.log(this.nearCondos[this.property].distance);
    this.directions = {start:'', end:'', instructions:'',duration:''};
   
  console.log(condoLat, condoLng);  
  console.log(spaceLat, spaceLng);


  this.directionsRenderer.setMap(this.map2);
  this.calculateAndDisplayRoute(this.directionsService, this.directionsRenderer,condoLat, condoLng,spaceLat,spaceLng);
  }
 
  calculateAndDisplayRoute(directionsService, directionsRenderer,clat, clng,slat, slng, ) {
    let selectedMode = 'WALKING';
        
    directionsService.route(
      {
        origin: { lat:clat, lng: clng }, 
        destination: { lat: slat, lng: slng },
        provideRouteAlternatives:true ,
        travelMode: selectedMode,
        
        
      },
      (response, status) => {
        if (status == "OK") {
          directionsRenderer.setDirections(response);
          console.log(response);
          console.log(response.routes[0].legs[0].steps);
          
          var pointA = response.routes[0].legs[0].start_location;
          var pointB = response.routes[0].legs[0].end_location;          
          this.directions.start = response.routes[0].legs[0].start_address;
          console.log(this.directions);
          
          
          this.directions.end = response.routes[0].legs[0].end_address;
          var steps = response.routes[0].legs[0].steps;
          this.markerA = new google.maps.Marker({
            position: pointA,
            icon:this.start_pin
          });
          this.markerB = new google.maps.Marker({
            position: pointB,
            icon:this.end_pin
          });
          this.markerA.setMap(this.map2);
          this.markerB.setMap(this.map2);
          var values = []
          // var instr1 = response.routes[0].legs[0].steps[0].instructions.replace(/<[^>]*>?/gm, '').replace(/Partial restricted usage road/gi, ' ').replace(/Restricted usage road/gi, ' ');
          // var instr2 = response.routes[0].legs[0].steps[1].instructions.replace(/<[^>]*>?/gm, '').replace(/Partial restricted usage road/gi, ' ').replace(/Restricted usage road/gi, ' ');
          // this.directions.instructions = `${instr1}, ${instr2}`;
          this.directions.duration = response.routes[0].legs[0].duration.text;
          for (const step of steps) {
            let value = step.instructions.replace(/<[^>]*>?/gm, '').replace(/Partial restricted usage road/gi, ' ').replace(/Restricted usage road/gi, ' ');
            values.push(value);            
          }
          this.directions.instructions = values.join();
          console.log(this.directions.instructions);
          
          
          const center = new google.maps.LatLng(slat, slng);
          this.map.panTo(center);
          
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );
  }

  
  
  nearbyChanged(e){
    console.log(this.segment2);
    
      }
      transportChanged(e){
        console.log(this.segment3);
        
          }
  
  selectedValue(i){
    if(i !== 0 ){
      this.mheight = '0px';
    }
console.log('index:',i,'value:',this.selectedIndex);    
this.selectedIndex = i;
console.log('index:',i,'value:',this.selectedIndex);
  }
  nearbyValue(i){
    this.nearbyIndex = i
  }
  
  transportValue(i){
    this.transportIndex = i
  }
  
  loadTinderCards() {
    for (let i = 0; i < this.locationFilter.length; i++) {
      if (i < 3) {
this.cards.push(this.locationFilter[i]);
      }
      
    }

  };
getCondos(){
  console.log('getting condos');
  console.log(this.locationFilter[this.active]);
  
  
  this.nearCondos = null;
  var id  = this.locationFilter[this.active].name;
  console.log(id);
  
  
  this.api.sqlNearCondos(id).then((data) => {
    this.nearCondos = data.data;
    this.nearCondos.sort(
      this.compareValues("distance", "asc")
    );
    console.log(this.nearCondos);
    
 
  });
}

view(i){
if(this.markerA){
  this.markerA.setMap(null)
  this.markerB.setMap(null)
}
console.log(i);
if(this.property == i && this.open){
  this.open = false;
  this.mheight = '0px';
  console.log(this.open);
  this.directionsRenderer.setMap(null);
  this.infoWindows[this.active].open(this.map, this.demandMarkers[this.active]);
  this.infoWindows[this.active].open(this.map2, this.demandMarkers[this.active]);
  return
} else {
  this.open = false;
  this.mheight = '200px';
  this.property = i;
this.getDirections();
setTimeout(() => {
  if(!this.open){
    this.open = true;

    console.log(this.open);
      }
}, 500);

}





}
  FindMore(){
    this.showMap = true;
  }

  logChoice(choice) {
    console.log(this.cards.length);
    console.log(choice)
    this.swipeCount++
    if(this.swipeCount == 1){
      this.cards.push(this.locationFilter[0])
    }
    if(this.swipeCount == 2){
      this.cards.push(this.locationFilter[1])
    }
    if(this.swipeCount == 3){
      this.cards.push(this.locationFilter[2])
      this.swipeCount = 0;
      
    }
  };
  start(){
          var titleELe = document.getElementById('search');
      this.content.scrollToPoint(0, titleELe.offsetTop, 1000);    
    }
    bottom(){
      var titleELe = document.getElementById('btm');
  this.content.scrollToPoint(0, titleELe.offsetTop, 2000);    
}
top(){
  this.content.scrollToTop(1000);
}
    loadMore(){
      this.results = 28;
      this.start();
    }
  

  async getUserLocation() {
      Plugins.Geolocation.getCurrentPosition().then((resp) => {
        this.zone.run(() => {
          this.lat = resp.coords.latitude;
          this.lng = resp.coords.longitude;
          this.addMap(this.lat, this.lng);
          this.addMaker(this.lat, this.lng);
        });
      })
      .catch((error) => {
        console.log(error);
        this.addMap(this.lat, this.lng);
        this.addMaker(this.lat, this.lng);
      });
  }
  async getEngaged() {
    this.locations = [];  
        this.api.apiGetRequest('offices').then((res) => {
          const offices = res.data 
          console.log(offices);
          
          this.storage.set("engageAdd", res.data).then(() => {
                  
            for (const item of offices) {
              if (item.public) {
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
              this.locations.push(location);
            }
          }
            this.getGeoData();
          });
        });
  }
  getLocations(item) {
    var location: any = {};
    console.log("here");

    this.api.getAddbyId(item.locId).then((data) => {
      this.counter++;
      console.log(data.data);

      location.name = item.building;
      location.locId = item.refId;
      location.area = item.area;
      location.area_2 = item.area_2;
      location.lat = data.data.Latitude;
      location.lng = data.data.Longitude;
      location.dist = "0";
      this.locations.push(location);
    });
    console.log(this.locations.length, this.counter);

    if (this.locations.length == this.counter) {
      console.log("geocode");

      this.getGeoData();
      this.getMarkers();
    }
  }

  close() {
    this.modal.dismiss();
  }

  async getGeoLocation(lat: number, lng: number, type?) {
    if (navigator.geolocation) {
      let geocoder = await new google.maps.Geocoder();
      let latlng = await new google.maps.LatLng(lat, lng);
      let request = { latLng: latlng };

      await geocoder.geocode(request, (results, status) => {
        if (status == google.maps.GeocoderStatus.OK) {
          console.log(results);
          
          let result = results[0];
          console.log(result.formatted_address);
          //this.latLngResult = result.formatted_address.split(',')[0];
          this.zone.run(() => {
            if (result != null) {
              this.userCity = result.formatted_address;
              if (type === "reverseGeocode") {
 //               this.latLngResult = result.formatted_address.split(',')[0];
              }
            }
          });
        }
      });
    }
  }
  addMap(lat, lng) {
    let latLng = new google.maps.LatLng(lat, lng);
    let mapOptions = {
      center: latLng,
      zoom: 13,
      gestureHandling: "cooperative",
      mapTypeControl: false,
      streetViewControl: false,
      disableDoubleClickZoom: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    let mapOptions2 = {
      center: latLng,
      zoom: 90,
      gestureHandling: "cooperative",
      mapTypeControl: false,
      streetViewControl: false,
      disableDoubleClickZoom: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.map2 = new google.maps.Map(this.mapElement2.nativeElement, mapOptions2);
    var rendererOptions = {
      map: this.map2,
     suppressMarkers: true
  };
    this.directionsRenderer = new google.maps.DirectionsRenderer(rendererOptions);
    
    


    // this.map.addListener("dblclick", (event) => {
      
    //   this.activeInfoWindow.close();
    //   if(this.activeMarker){
    //     for (const marker of this.demandMarkers) {
    //       if (marker.title == this.activeMarker) {
    //         marker.setIcon(this.pin_unselected);
    //       }
    //     }
    //   }
    //   console.log("new marker", event["latLng"].lat(), event["latLng"].lng());
    //   this.lat = event["latLng"].lat();
    //   this.lng = event["latLng"].lng();
    //   this.getGeoLocation(this.lat,this.lng);
    //   this.getGeoData();
    // });
    

  }

  addMaker(lat: number, lng: number) {
    if(this.currentPosition){
      this.currentPosition.setMap(null);
    }
    this.currentPosition = new google.maps.Marker({
      position: { lat, lng },
      icon:this.position_pin
    });
    //this.currentPosition.setMap(this.map);
    //information.open(this.map, this.currentPosition);
    const center = new google.maps.LatLng(lat, lng);
    this.map.panTo(center);
    this.getEngaged();
  }

  forwardGeocode(address) {
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        this.zone.run(() => {
          this.lat = results[0].geometry.location.lat();
          this.lng = results[0].geometry.location.lng();
          this.getGeoLocation(this.lat, this.lng);
          this.addMaker(this.lat, this.lng);
        });
        this.info = {
          name: address,
          lat: this.lat,
          lng: this.lng,
        };
        console.log(this.lat, this.lng);


        this.getGeoData();
      } else {
        alert("Error - " + results + " & Status - " + status);
      }
    });
  }

  UpdateSearchResults() {
  console.log(this.autocomplete.input);
  
    if (this.autocomplete.input == "") {   
      this.autocompleteItems = [];
      this.autocomplete.input = "";
       } else{
      this.GoogleAutocomplete.getPlacePredictions(
        { input: this.autocomplete.input,componentRestrictions: { country: "sg" }, },
        (predictions, status) => {
          this.autocompleteItems = [];
          this.zone.run(() => {
            predictions.forEach((prediction) => {
              this.autocompleteItems.push(prediction);
            });
          });
        }
      );
    }
    
  }

  SelectSearchResult(item) {
    this.property = 0;
    this.newLocation = true;
    console.log(item);
    this.forwardGeocode(item.description);
    //this.latLngResult = item.description.split(',')[0];
   this.ClearAutocomplete();
  }

  ClearAutocomplete() {
    this.autocompleteItems = [];
    this.autocomplete.input = "";
  }

  select() {
    this.modal.dismiss(this.info);
  }

  getGeoData() {
   
    if(this.demandMarkers.length > 0){
      console.log('here');      
      for (let i = 0; i < this.demandMarkers.length; i++) {
        const element = this.demandMarkers[i];
        element.setMap(null);        
      }
      this.demandMarkers = [];
    }
    //this.presentLoading().then(() => {
      this.locationFilter = null;
      this.plans = [];

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

      this.locationFilter = this.locations.sort(
        this.compareValues("dist", "asc")
      );
      
      this.getBusStations();
      this.getMrtStations();
      this.getCondos();
      this.getMarkers();

      let latlng = new google.maps.LatLng(
        this.locationFilter[this.active].lat,
        this.locationFilter[this.active].lng
              );
              console.log(this.locationFilter[this.active]);
              
      this.latLngResult = this.locationFilter[this.active].area;
      this.map.panTo(latlng);
      console.log(this.locationFilter);
      this.getMemberships();
      
      

      

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
    var count = 0;

    this.infoWindows = [];
    this.demandMarkers = [];
    if (this.initial) {
      for (let i = 0; i < this.locationFilter.length; i++) {
        const location = this.locationFilter[i];
        if (location.name == "Great World CIty" ) {
          this.active = i;
        }
        
      }
      
    } else{
      this.active = 0;
    }

    for (const data of this.locationFilter) {
    
      this.addMarkersToMap(data);
    }

   
      
    if (this.demandMarkers[this.active].label.text == 'open') {
      this.demandMarkers[this.active].setIcon(this.pin_selected);
    } else{
      this.demandMarkers[this.active].setIcon(this.not_open_pin);
    }
    this.infoWindows[this.active].open(this.map, this.demandMarkers[this.active]);
    this.activeInfoWindow = this.infoWindows[this.active]
    this.activeMarker.title = this.demandMarkers[this.active].title;
    this.activeMarker.open = this.demandMarkers[this.active].label.text;
    let latlng = new google.maps.LatLng(
      this.locationFilter[this.active].lat,
      this.locationFilter[this.active].lng
            );            
    this.latLngResult = this.locationFilter[this.active].area;
    this.map.panTo(latlng);
    
  }
  addMarkersToMap(location) {
    let officeMarker;

    var self = this;
    var information = new google.maps.InfoWindow({
      content:
'<div style="display:flex;flex-direction:column;min-height:110px;justifycontent:center;align-items:center"><img id="image" style="width:155px;height:110px;border-radius:10px" src=' +
        location.image +'></div>',
    });
    
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
        icon:this.notOpen_pin
      });
    }
    officeMarker.addListener("click", function () {
      self.initial = false;
     
      if (self.activeInfoWindow) {
        self.activeInfoWindow.close();
        for (const marker of self.demandMarkers) {
          
          if (marker.title == self.activeMarker.title && self.activeMarker.open == 'open') {
                                       
            marker.setIcon(self.pin_unselected);
          }
          if (marker.title == self.activeMarker.title && self.activeMarker.open == 'not open') {
                          
            marker.setIcon(self.notOpen_pin);
          }
        }
      }
      for (let i = 0; i < self.locationFilter.length; i++) {
        console.log('here');
        
        const location = self.locationFilter[i];
        if (location.name == officeMarker.title) {
          console.log('found');
          self.active = i;
          console.log(self.active);
          self.activeMarker.title = officeMarker.title;
       self.activeMarker.open = officeMarker.label.text;
       if (officeMarker.label.text == 'open') {
        self.demandMarkers[self.active].setIcon(self.pin_selected);
       } else{
        self.demandMarkers[self.active].setIcon(self.not_open_pin);
       }

       self.infoWindows[self.active].open(self.map, self.demandMarkers[self.active]);
       self.activeInfoWindow = self.infoWindows[self.active];
       
 
       let latlng = new google.maps.LatLng(
         self.locationFilter[self.active].lat,
         self.locationFilter[self.active].lng
               );
               console.log(self.locationFilter[self.active]);
               
       self.latLngResult = self.locationFilter[self.active].area;

       self.map.panTo(latlng);
       console.log(self.locationFilter[self.active]);
       self.getBusStations();
       self.getMrtStations();
       self.getCondos();
       self.getMemberships();
          
        }
      }

      // self.lat = officeMarker.position.lat();
      //  self.lng = officeMarker.position.lng();
       
      
      


    });
    this.demandMarkers.push(officeMarker);
       
    officeMarker.setMap(this.map);
    
   
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
    this.map2.panTo(center);
    this.demandMarkers[i].setIcon(this.pin_selected);
    this.infoWindows[i].open(this.map, this.demandMarkers[i]);
    this.infoWindows[i].open(this.map2, this.demandMarkers[i]);
    this.activeInfoWindow = this.infoWindows[i];
    this.getMrtStations();
    this.getBusStations();
  }

  async reserveModal() {    
    let navigation: NavigationExtras = {
    };
    this.router.navigate(["register"], navigation);
  
}
  reserve(id) {
   var officePlans = this.locationFilter[0];
  this.iab.create(`https://my.hoodwork.co/signup/plans/${id}?office=${officePlans.id}`)
  }

  async presentLoading() {
    const loading = await this.loader.create({
      cssClass: "loader",
    });
    await loading.present();
    return;
  }

  subscribe(){
    
  }
 async Share(){
    var text: "Hey check out Hoodwork"
    var imgurl:"../../assets/images/logo.png"
    var link:"app.hoodwork.co/offices"
    let shareRet = await Plugins.Share.share({
      title: 'Hey check out Hoodwork',
      text: 'Really awesome thing you need to see right meow',
      url: 'https://app.hoodwork.co/offices',
      dialogTitle: 'Share with buddies'
    });

     

    
  
  }
  ShareWhatsapp(){

  }

  ShareFacebook(){

  }

  SendEmail(){

  }

  SendTwitter(){

  }

  SendInstagram(){

  }
  whatsapp(){

  }
}
