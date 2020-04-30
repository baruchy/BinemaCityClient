import {Component, OnInit} from '@angular/core';
import {GlobalService} from '../../services/global.service';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  basket = {
    movies: [],
    totalItems: [],
    total: 0
  };

  order = {
    user: '',
    movies: [],
    price: 0,
    order_date: new Date(),
    card_digits: '',
    is_bitcoin: false
  };
  rate: number = 0;

  total = 0;
  user: any;

  constructor(private service: GlobalService, private auth: AuthService, private router: Router) {
    this.user = this.auth.getUser();
    this.order.user = this.user._id;
  }


  ngOnInit() {
    this.basket = this.service.getBasket();
    if (this.basket) {
      this.total = this.basket.total;
    }

    // Get the bitcoin rate
    this.service.getBitcoinRate().subscribe((res: any) => {
      this.rate = res.bpi.USD.rate_float;
    });
    // this.service.onProductAddCallback$.subscribe(data => {
    //     this.basket = data;
    // });

  }

//Pay function set the order to db
  pay() {
  if (isNaN(Number(this.order.card_digits))) {
  alert('please add valid card number');
  return;
  }
  if (!this.basket.movies || this.basket.movies.length == 0) {
    alert('No movies in the busket');
    return;
  }
    this.order.movies = this.basket.movies;
    this.order.price = this.total;
    this.order.order_date = new Date();
    this.service.createOrders(this.order).subscribe((res: any) => {
      this.service.clearBusket();
      alert('Order created successfully');
      this.router.navigateByUrl('myorder');
    });
  }

//when clcick on checkbox it convert the total to bitcoin
  onBitcoinPressed() {
    this.order.is_bitcoin = !this.order.is_bitcoin;


    if (this.order.is_bitcoin) {
      this.total = this.basket.total / this.rate;
    } else {
      this.total = this.basket.total;
    }


  }


}
