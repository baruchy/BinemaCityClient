import {Component, OnInit} from '@angular/core';
import {Input} from "@angular/core";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  @Input() alertType: string;
  @Input() alertMessage: string;
  @Input() alertClass: string;
  isShow: boolean = false;

  constructor() {
  }

  ngOnInit() {
  }

  show() {
    this.isShow = true;

    setTimeout(() => {
      this.isShow = false;

    }, 3000);
  }
}
