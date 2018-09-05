import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-tagged-profile',
  templateUrl: 'tagged-profile.html',
})
export class TaggedProfile {

  // You can get this data from your API. This is a dumb data for being an example.
  public images = [
    {
      id: 1,
      username: '김권일',
      profile_img: 'https://avatars.githubusercontent.com/u/37039276?s=460&v=4',
      post_img: '/assets/img/image_src/grov_mall.png'
    },
    {
      id: 2,
      username: '김권일',
      profile_img: 'https://avatars.githubusercontent.com/u/37039276?s=460&v=4',
      post_img: '/assets/img/image_src/la_koran_town.jpg'
    },
    {
      id: 3,
      username: '김권일',
      profile_img: 'https://avatars.githubusercontent.com/u/37039276?s=460&v=4',
      post_img: '/assets/img/image_src/gripeace.jpg'
    }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

}
