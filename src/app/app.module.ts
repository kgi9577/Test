import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { Home } from '../pages/home/home';
import { PostPopover } from '../pages/home/post-popover';
import { Search } from '../pages/search/search';
import { ModalPost } from '../pages/modal-post/modal-post';
import { Messages } from '../pages/messages/messages';
import { MessageDetail } from '../pages/message-detail/message-detail';
import { NewMessage } from '../pages/new-message/new-message';
import { Notifications } from '../pages/notifications/notifications';
import { Profile } from '../pages/profile/profile';
import { EditProfile } from '../pages/edit-profile/edit-profile';
import { TaggedProfile } from '../pages/tagged-profile/tagged-profile';
import { SavedProfile } from '../pages/saved-profile/saved-profile';
import { Options } from '../pages/options/options';
import { Comments } from '../pages/comments/comments';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';
import * as firebase from 'firebase';
import 'firebase/firestore';

var config = {
  apiKey: "AIzaSyC5JcGefosO4aQu437vltDtbHTLXSiFpxE",
  authDomain: "lifegram-214905.firebaseapp.com",
  databaseURL: "https://lifegram-214905.firebaseio.com",
  projectId: "lifegram-214905",
  storageBucket: "lifegram-214905.appspot.com",
  messagingSenderId: "491339857228"
};

export default !firebase.apps.length 
  ? firebase.initializeApp(config).firestore()
  : firebase.app().firestore();

@NgModule({
  declarations: [
    MyApp,
    Home,
    PostPopover,
    Search,
    ModalPost,
    Messages,
    MessageDetail,
    NewMessage,
    Notifications,
    Profile,
    EditProfile,
    TaggedProfile,
    SavedProfile,
    Options,
    Comments,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Home,
    PostPopover,
    Search,
    ModalPost,
    Messages,
    MessageDetail,
    NewMessage,
    Notifications,
    Profile,
    EditProfile,
    TaggedProfile,
    SavedProfile,
    Options,
    Comments,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
