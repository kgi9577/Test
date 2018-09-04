import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform } from 'ionic-angular';

import { ModalPost } from '../modal-post/modal-post';
import { EditProfile } from '../edit-profile/edit-profile';
import { Options } from '../options/options';
import { TaggedProfile } from '../tagged-profile/tagged-profile';
import { SavedProfile } from '../saved-profile/saved-profile';

declare var google: any;
var censusMin = Number.MAX_VALUE, censusMax = -Number.MAX_VALUE;

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class Profile {
  @ViewChild('map') mapRef: ElementRef;
  map: any;

  public profile_segment: string;

  // You can get this data from your API. This is a dumb data for being an example.
  public images = [
    {
      id: 1,
      username: 'candelibas',
      profile_img: 'https://avatars1.githubusercontent.com/u/918975?v=3&s=120',
      post_img: 'https://scontent-cdg2-1.cdninstagram.com/t51.2885-15/e35/13473123_1544898359150795_654626889_n.jpg'
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
    {
      id: 4,
      username: 'candelibas',
      profile_img: 'https://avatars1.githubusercontent.com/u/918975?v=3&s=120',
      post_img: 'https://scontent-cdg2-1.cdninstagram.com/t51.2885-15/e15/891528_841068522581102_1591061904_n.jpg'
    },
    {
      id: 5,
      username: 'candelibas',
      profile_img: 'https://avatars1.githubusercontent.com/u/918975?v=3&s=120',
      post_img: 'https://scontent-frx5-1.cdninstagram.com/t51.2885-15/e35/10809765_1474804169496730_887570428_n.jpg'
    },
    {
      id: 6,
      username: 'candelibas',
      profile_img: 'https://avatars1.githubusercontent.com/u/918975?v=3&s=120',
      post_img: 'https://scontent-cdg2-1.cdninstagram.com/t51.2885-15/e15/891515_1524153351163603_439436363_n.jpg'
    }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public platform: Platform) {
    platform.ready().then(() => {
      this.initMap();
    });
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

  loadMapShapes() {
    // load US state outline polygons from a GeoJson file
    this.map.data.loadGeoJson('https://storage.googleapis.com/mapsdevsite/json/states.js', { idPropertyName: 'STATE' });

    // wait for the request to complete by listening for the first feature to be
    // added
    google.maps.event.addListenerOnce(this.map.data, 'addfeature', function () {
      google.maps.event.trigger(document.getElementById('census_variable'),
        'change');
    });
  }

  loadCensusData(variable) {
    // load the requested variable from the census API (using local copies)
    var xhr = new XMLHttpRequest();
    xhr.open('GET', variable + '.json');
    xhr.onload = function () {
      var censusData = JSON.parse(xhr.responseText);
      censusData.shift(); // the first row contains column names
      censusData.forEach(function (row) {
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
      document.getElementById('census_min').textContent =
        censusMin.toLocaleString();
      document.getElementById('census_max').textContent =
        censusMax.toLocaleString();
    };
    xhr.send();
  }

  clearCensusData() {
    censusMin = Number.MAX_VALUE;
    censusMax = -Number.MAX_VALUE;
    this.map.data.forEach(function (row) {
      row.setProperty('census_variable', undefined);
    });
    document.getElementById('data_box').style.display = 'none';
    document.getElementById('data_caret').style.display = 'none';
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

  mouseInToRegion

  mouseOutOfRegion

  initMap() {
    var mapStyle = [{
      'stylers': [{ 'visibility': 'off' }]
    }, {
      'featureType': 'landscape',
      'elementType': 'geometry',
      'stylers': [{ 'visibility': 'on' }, { 'color': '#fcfcfc' }]
    }, {
      'featureType': 'water',
      'elementType': 'geometry',
      'stylers': [{ 'visibility': 'on' }, { 'color': '#bfd4ff' }]
    }];

    let location = new google.maps.LatLng(-34.9290, 138.6010);

    let options = {
      center: location,
      zoom: 4,
      styles: mapStyle
    };

    this.map = new google.maps.Map(this.mapRef.nativeElement, options);
    this.map.data.setStyle(this.styleFeature);
    this.map.data.addEventListener('mouseover', (e) => {
      // set the hover state so the setStyle function can change the border
      e.feature.setProperty('state', 'hover');
  
      var percent = (e.feature.getProperty('census_variable') - censusMin) /
        (censusMax - censusMin) * 100;
  
      // update the label
      document.getElementById('data_label').textContent =
        e.feature.getProperty('NAME');
      document.getElementById('data_value').textContent =
        e.feature.getProperty('census_variable').toLocaleString();
      document.getElementById('data_box').style.display = 'block';
      document.getElementById('data_caret').style.display = 'block';
      document.getElementById('data_caret').style.paddingLeft = percent + '%';
    });

    this.map.data.addEventListener('mouseout', (e) {
      // reset the hover state, returning the border to normal
      e.feature.setProperty('state', 'normal');
    });

    var selectBox = document.getElementById('census_variable');
    google.maps.event.addDomListener(selectBox, 'change', function () {
      this.clearCensusData();
      this.loadCensusData(selectBox.options[selectBox.selectedIndex].value);
    });

    // state polygons only need to be loaded once, do them now
    this.loadMapShapes();
  }

}
