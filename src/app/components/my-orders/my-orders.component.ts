import {Component, OnInit} from '@angular/core';
import {GlobalService} from '../../services/global.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']

})
export class MyOrdersComponent implements OnInit {
  orders: any[];
  user: any = {};


  constructor(private auth: AuthService, private service: GlobalService) {
    this.user = this.auth.getUser();

    this.service.getUserOrders(this.user._id).subscribe((res: any) => {
      this.orders = res;
    });
  }

  ngOnInit() {

  }

}
