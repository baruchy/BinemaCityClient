import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {GlobalService} from '../../services/global.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  isAdmin = false;
  numberOfUsers: string = '0';
  basket: any = {products: [], total: 0, totalItems: 0};
  private user: any;

  constructor(private auth: AuthService, private service: GlobalService) {
    this.user = this.auth.getUser();
    if (this.user) {
      this.isLoggedIn = true;
      this.isAdmin = this.user.role == 'admin';
    }

    this.service.onClearBusketCallback$.subscribe(data => {
      this.basket = this.service.getBasket;
    });

    this.service.onRefreshCallback$.subscribe(data => {
      this.numberOfUsers = data;
    });
    this.service.onMovieAddCallback$.subscribe(data => {
      this.basket = data;
    });

    this.service.onUserLoggedCallback$.subscribe(data => {
      this.numberOfUsers = data;
      this.user = this.auth.getUser();
      if (this.user) {
        this.isLoggedIn = true;
        this.isAdmin = this.user.role == 'admin';
      }
    });

    this.service.onUserUnLoggedCallback$.subscribe(data => {
      this.numberOfUsers = data;
      this.user = null;
    });
  }

  ngOnInit() {
	  this.service.emitOnRefresh();
  }

  logout() {
    this.service.logOut();
    this.isLoggedIn = false;
  }

}
