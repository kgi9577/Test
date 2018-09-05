import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

import { ModalPost } from '../modal-post/modal-post';
import { EditProfile } from '../edit-profile/edit-profile';
import { Options } from '../options/options';
import { TaggedProfile } from '../tagged-profile/tagged-profile';
import { SavedProfile } from '../saved-profile/saved-profile';
import { } from '@angular/core/src/view';

declare var google: any;
var censusMin = Number.MAX_VALUE, censusMax = -Number.MAX_VALUE;
var mapStyle = [{
  'featureType': 'all',
  'elementType': 'all',
  'stylers': [{ 'visibility': 'off' }]
}, {
  'featureType': 'landscape',
  'elementType': 'geometry',
  'stylers': [{ 'visibility': 'on' }, { 'color': '#fcfcfc' }]
}, {
  'featureType': 'water',
  'elementType': 'labels',
  'stylers': [{ 'visibility': 'off' }]
}, {
  'featureType': 'water',
  'elementType': 'geometry',
  'stylers': [{ 'visibility': 'on' }, { 'hue': '#5f94ff' }, { 'lightness': 60 }]
}];

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class Profile {
  @ViewChild('map') mapRef: ElementRef;
  @ViewChild('censvariable') cvRef: ElementRef;
  @ViewChild('census_min') cminRef: ElementRef;
  @ViewChild('census_max') cmaxRef: ElementRef;
  @ViewChild('data_caret') dcRef: ElementRef;
  @ViewChild('data_box') dbRef: ElementRef;
  @ViewChild('data_label') dlRef: ElementRef;
  @ViewChild('data_value') dvRef: ElementRef;

  public map: any;
  public profile_segment: string;

  // You can get this data from your API. This is a dumb data for being an example.
  public images = [
    {
      id: 1,
      username: '김권일',
      profile_img: 'https://avatars.githubusercontent.com/u/37039276?s=460&v=4',
      post_img: "/assets/img/image_src/grov_mall.png"
    },
    {
      id: 2,
      username: 'candelibas',
      profile_img: 'https://avatars1.githubusercontent.com/u/918975?v=3&s=120',
      post_img: 'https://scontent-cdg2-1.cdninstagram.com/t51.2885-15/e35/12940826_1673029922963013_921771297_n.jpg'
    },
    {
      id: 3,
      username: 'candelibas',
      profile_img: 'https://avatars1.githubusercontent.com/u/918975?v=3&s=120',
      post_img: 'https://scontent-cdg2-1.cdninstagram.com/t51.2885-15/e15/10852865_738738146215825_1258215298_n.jpg'
    },
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
  }

  // Define segment for everytime when profile page is active
  ionViewWillEnter() {
    this.profile_segment = 'grid';
  }

  goEditProfile() {
    // Open it as a modal page
    let modal = this.modalCtrl.create(EditProfile);
    modal.present();
  }

  goOptions() {
    this.navCtrl.push(Options, {});
  }

  goTaggedProfile() {
    this.navCtrl.push(TaggedProfile);
  }

  goSavedProfile() {
    this.navCtrl.push(SavedProfile);
  }

  // Triggers when user pressed a post
  pressPhoto(user_id: number, username: string, profile_img: string, post_img: string) {
    this.presentModal(user_id, username, profile_img, post_img);
  }

  // Set post modal
  presentModal(user_id: number, username: string, profile_img: string, post_img: string) {
    let modal = this.modalCtrl.create(ModalPost,
      { // Send data to modal
        user_id: user_id,
        username: username,
        profile_img: profile_img,
        post_img: post_img
      }, // This data comes from API!
      { showBackdrop: true, enableBackdropDismiss: true });
    modal.present();
  }

  ionViewDidLoad() {
    this.initMap();
  }

  initMap() {
    this.map = new google.maps.Map(this.mapRef.nativeElement, {
      center: { lat: 40, lng: -100 },
      zoom: 4,
      styles: mapStyle
    });

    this.map.data.setStyle(this.styleFeature);
    this.map.data.addListener('mouseover', (e) => {
      // set the hover state so the setStyle function can change the border
      e.feature.setProperty('state', 'hover');

      var percent = (e.feature.getProperty('census_variable') - censusMin) /
        (censusMax - censusMin) * 100;

      // update the label
      this.dlRef.nativeElement.textContent =
        e.feature.getProperty('NAME');
      this.dvRef.nativeElement.textContent =
        e.feature.getProperty('census_variable').toLocaleString();
      this.dbRef.nativeElement.style.display = 'block';
      this.dcRef.nativeElement.style.display = 'block';
      this.dcRef.nativeElement.style.paddingLeft = percent + '%';
    });

    this.map.data.addListener('mouseout', (e) => {
      // reset the hover state, returning the border to normal
      e.feature.setProperty('state', 'normal');
    });

    var selectBox = this.cvRef.nativeElement;
    google.maps.event.addDomListener(selectBox, 'change', () => {
      this.clearCensusData();
      this.loadCensusData(selectBox.value);
    });

    this.loadMapShapes();

  }

  loadCensusData(variable) {
    // load the requested variable from the census API
    var xhr = new XMLHttpRequest();
    xhr.open('GET', variable + '.json');
    xhr.onload = () => {
      var censusData = JSON.parse(xhr.responseText);
      censusData.shift(); // the first row contains column names
      censusData.forEach((row) => {
        var censusVariable = parseFloat(row[0]);
        var stateId = row[1];

        // keep track of min and max values
        if (censusVariable < censusMin) {
          censusMin = censusVariable;
        }
        if (censusVariable > censusMax) {
          censusMax = censusVariable;
        }

        // update the existing row with the new data
        this.map.data
          .getFeatureById(stateId)
          .setProperty('census_variable', censusVariable);
      });

      // update and display the legend
      this.cminRef.nativeElement.textContent = censusMin.toLocaleString();
      this.cmaxRef.nativeElement.textContent = censusMax.toLocaleString();
    };
    xhr.send();
  }

  clearCensusData() {
    censusMin = Number.MAX_VALUE;
    censusMax = -Number.MAX_VALUE;
    this.map.data.forEach((row) => {
      row.setProperty('census_variable', undefined);
    });
    this.dbRef.nativeElement.style.display = 'none';
    this.dcRef.nativeElement.style.display = 'none';
  }

  styleFeature(feature) {
    var low = [5, 69, 54];  // color of smallest datum
    var high = [151, 83, 34];   // color of largest datum

    // delta represents where the value sits between the min and max
    var delta = (feature.getProperty('census_variable') - censusMin) /
      (censusMax - censusMin);

    var color = [];
    for (var i = 0; i < 3; i++) {
      // calculate an integer color based on the delta
      color[i] = (high[i] - low[i]) * delta + low[i];
    }

    // determine whether to show this shape or not
    var showRow = true;
    if (feature.getProperty('census_variable') == null ||
      isNaN(feature.getProperty('census_variable'))) {
      showRow = false;
    }

    var outlineWeight = 0.5, zIndex = 1;
    if (feature.getProperty('state') === 'hover') {
      outlineWeight = zIndex = 2;
    }

    return {
      strokeWeight: outlineWeight,
      strokeColor: '#fff',
      zIndex: zIndex,
      fillColor: 'hsl(' + color[0] + ',' + color[1] + '%,' + color[2] + '%)',
      fillOpacity: 0.75,
      visible: showRow
    };
  }

  loadMapShapes() {
    // load US state outline polygons from a GeoJSON file
    this.map.data.loadGeoJson('https://storage.googleapis.com/mapsdevsite/json/states.js', { idPropertyName: 'STATE' });

    google.maps.event.addListenerOnce(this.map.data, 'addfeature', () => {
      google.maps.event.trigger(this.cvRef.nativeElement,
        'change');
    });
  }

  calculateRoute() {
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();
    var startPoint = new google.maps.LatLng(27.721503, 85.362072);
    var departPoint = new google.maps.LatLng(27.711360, 85.318781);

    var mapOptions = {
      zoom: 14,
      center: startPoint
    };

    var request = {
      origin: 'Chicago, IL',
      destination: 'Los Angeles, CA',
      waypoints: [
        {
          location: 'Joplin, MO',
          stopover: false
        }, {
          location: 'Oklahoma City, OK',
          stopover: true
        }],
      provideRouteAlternatives: false,
      travelMode: 'DRIVING',
      drivingOptions: {
        departureTime: new Date(/* now, or future date */),
        trafficModel: 'pessimistic'
      },
      unitSystem: google.maps.UnitSystem.IMPERIAL
    };

    this.map = new google.maps.Map(this.mapRef.nativeElement, mapOptions);

    directionsDisplay.setMap(this.map);

    directionsService.route(request, (result, status) => {
      if (status == "OK") {
        directionsDisplay.setDirections(result);
      }
    });
  }
}