import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Headers, Http } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EvindService } from './evind.service';
import { EventService } from './event.service';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
// import { AttEvService } from './attendevent.service';

// import { Http } from '@angular/http';
// import { EventService } from './event.service';
// import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
  selector: 'eview',
  // directives: [ROUTER_DIRECTIVES],
  providers: [EvindService, EventService],
  template: `
  <div id="eventview">
  <div class="eventHeader">{{eventName}}</div>
  <div class="eventPict"><img src={{eventPict}}></div>
  <div class="eventLink"><a href={{eventLink}} target="_blank">View More Info</a></div>
  <div class="eventInfo">
    <span class="eventDate"><b>Date:</b> {{eventDate}}</span><br>
    <span class="eventLocation"><b>Location:</b> {{eventLocation}}</span>
  </div>
  <div class="eventDesc">{{eventDesc}}</div>
  <div class="postedBy"><b>Event Posted By:</b> {{eventPostBy}}</div>
  <div class="attending">
    <b>People Attending this Event:</b>
     <ul>
       <li *ngFor="let person of attending">{{person}}</li>
     </ul>
    <div class="attendlist"></div>
    <button (click)="handleAttend()">I'm interested in this event!</button>
  </div>
      <div class="notification">
        <button (click)="notiForm()">Enable Notifications for this Event</button>
        <div id="notiForm" *ngIf="shownotiForm">
          <form [formGroup]="appointment" (ngSubmit)="newAppt(appointment.value)">
            Enter the phone number for which you would like to receive SMS notifications:<br>
            <input formControlName="phoneNumber" type="text" placeholder="Phone Number"/> 
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
      <button (click)="toggleChat()">{{showChatText}}</button>
      <div *ngIf="showChat">
        <div id="chatroom">
          <div class="chatheader">Event Chat Room</div><br>
          <div id="chat-window">
            <div id="output"></div>
            <div id="feedback"></div>
          </div>
          <input id="handle" type="text" placeholder="Handle" />
          <input id="message" type="text" placeholder="Message" />
          <button id="send">Send</button>
        </div>
      </div>
      <div class="entryBackLink"><a routerLink="/">Back</a></div>
    </div> `

})

export class EviewComponent {

  id: string;
  eventDate: string;
  eventName: string;
  eventLocation: string;
  eventLink: string;
  eventPict: string;
  eventDesc: string;
  eventPostBy: string;
  attending: string[];
  showChatText: string;
  showChat: boolean;
  shownotiForm: boolean;
  getData: any;
  profile: any;
  name: string;
  image: string;
  userID: string;

  appointment = new FormGroup({
    phoneNumber: new FormControl('phoneNumber')
  });

  constructor(private route: ActivatedRoute, private _httpService: EvindService, public eventService: EventService) {
    this.id = route.snapshot.params['id'];
    this.showChatText = 'Go to event chat room';
    this.showChat = false;
    this.shownotiForm = false;
  }
  onTestGet(id) {
    this._httpService.getEvent(id).subscribe(data => {
      console.log(data);
      this.getData = data;
      this.eventName = data.title;
      this.eventDate = data.eventDate;
      this.eventPict = data.imgUrl;
      this.eventLink = data.link;
      this.eventDesc = data.description;
      this.eventPostBy = data.author;
      this.eventLocation = data.location;
      this.attending = data.attending;
    }, error => {
      console.error(error);
    }, () => {
      console.log('GET request complete');
    });
  }
  attEvent(user) {
    this._httpService.attendEvent(user).subscribe(() => {
      console.log('Successful POST request');
    }, error => {
      console.error(error);
    }, () => {
      console.log('Request complete');
    });
  }
  ngOnInit() {
    this.onTestGet(this.id);
    this.eventService.profile.subscribe(profile => {
      this.userID = profile.facebook.id;
      this.profile = profile;
      this.name = profile.facebook.displayName;
      this.image = profile.facebook.image;
    }, error => {
      console.error(error);
    }, () => {
      console.log('complete');
    });
  }
  handleAttend() {
    if (this.name) {
      this.attEvent({ name: this.name, event: this.getData });
      this.onTestGet(this.id);
    }
  }
  newAppt() {
    console.log(this.appointment.get('phoneNumber').value);
  }
  toggleChat() {
    if (this.showChat === true) {
      this.showChat = false;
      this.showChatText = 'Go to event chat room';
    } else {
      this.showChat = true;
      this.showChatText = 'Hide event chat room';
    }
  }
  notiForm() {
    if (this.shownotiForm === true) {
      this.shownotiForm = false;
    } else {
      this.shownotiForm = true;
    }
  }
}