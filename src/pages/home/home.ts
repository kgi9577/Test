import { Component, ViewChild } from '@angular/core';
import { App, NavController, Content, PopoverController } from 'ionic-angular';
import { PostPopover } from './post-popover';
import { Messages } from '../messages/messages';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class Home {
  @ViewChild(Content) content: Content;

  public like_btn = {
    color: 'black',
    icon_name: 'heart-outline'
  };

  public tap: number = 0;
  public information1: string;
  public information2: string;
  public information3: string;

  // You can get this data from your API. This is a dumb data for being an example.
  public stories = [
    {
      id: 1,
      img: 'https://avatars.githubusercontent.com/u/37039276?s=460&v=4',
      user_name: '김권일'
    },
    {
      id: 2,
      img: 'https://scontent-icn1-1.cdninstagram.com/vp/12e04c243e234bbc3b5eeeed5ddc170d/5C25103E/t51.2885-19/s150x150/19227751_486844421665379_8560746436638015488_a.jpg',
      user_name: '안채림'
    },
    {
      id: 3,
      img: 'https://scontent-icn1-1.cdninstagram.com/vp/74d4a001973ffb1c519909dc584b0316/5C328D7A/t51.2885-19/11906329_960233084022564_1448528159_a.jpg',
      user_name: '신승호'
    }
  ];

  public contents = [
  {
    id : 1
  },
  { 
    id : 2
  },
  {
    id : 3
  },
  {
    id : 4
  }
  ]

  constructor(public navCtrl: NavController, public popoverCtrl: PopoverController, public app: App) {
    this.information1 = "그리피스 천문대. \n 날씨도 너무 좋고 주변 음식들도 너무 맛있다 >_<";
    this.information2 = "그로브몰. \n 석양과 함께";
    this.information3 = "한인타운. \n 한인타운이지만 되게 이국적인 느낌!";
  
  }

  likeButton() {
    if(this.like_btn.icon_name === 'heart-outline') {
      this.like_btn.icon_name = 'heart';
      this.like_btn.color = 'danger';
      // Do some API job in here for real!
    }
    else {
      this.like_btn.icon_name = 'heart-outline';
      this.like_btn.color = 'black';
    }
  }

  tapPhotoLike(times) { // If we click double times, it will trigger like the post
    this.tap++;
    if(this.tap % 2 === 0) {
      this.likeButton();
    }
  }

  presentPostPopover() {
    let popover = this.popoverCtrl.create(PostPopover);
    popover.present();
  }

  goMessages() {
    this.app.getRootNav().push(Messages);
  }

  swipePage(event) {
    if(event.direction === 1) { // Swipe Left
      console.log("Swap Camera");
    } 

    if(event.direction === 2) { // Swipe Right
      this.goMessages();
    }
    
  }

  scrollToTop() {
    this.content.scrollToTop();
  }

}
