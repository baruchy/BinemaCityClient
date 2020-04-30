import {Component, OnInit, NgZone} from '@angular/core';
import {GlobalService} from '../../services/global.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {

  constructor(private service: GlobalService, private zone: NgZone, private auth: AuthService) {
  }

  busket: any;

  ngOnInit() {
    this.busket = this.service.getBasket();
  }

  removeFromBusket(p: any) {
    this.service.removeFromBusket(p);
  }

}
