import {Component, OnInit, Input} from '@angular/core';
import {GlobalService} from '../../services/global.service';
import {AuthService} from '../../services/auth.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']

})
export class MyOrdersComponent implements OnInit {
  orders: any[];
  user: any = {};
  mostRecomand: any = null;


  constructor(private auth: AuthService, private service: GlobalService) {
    this.user = this.auth.getUser();

    this.service.getUserOrders(this.user._id).subscribe((res: any) => {
      this.orders = res;
      this.getMostRecomanded();
    });
  }

  // Most recommended is the first movie in the most expensive order
  getMostRecomanded() {
    let prodIds = [];
    let prods = [];
    this.orders.forEach((o) => {
      o.movies.forEach((p) => {
        prodIds.push(p._id);
        prods.push(p);
      });
    });

    function mode(array) {
      if (array.length == 0) {
        return null;
      }
      var modeMap = {};
      var maxEl = array[0], maxCount = 1;
      for (var i = 0; i < array.length; i++) {
        var el = array[i];
        if (modeMap[el] == null) {
          modeMap[el] = 1;
        } else {
          modeMap[el]++;
        }
        if (modeMap[el] > maxCount) {
          maxEl = el;
          maxCount = modeMap[el];
        }
      }
      return maxEl;
    }

    let prodId = mode(prodIds);
    prods.forEach((p) => {
      if (p._id == prodId) {
        this.mostRecomand = p;
      }
    });
  }

  ngOnInit() {

  }

}
