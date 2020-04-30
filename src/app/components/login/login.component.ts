import {Component, OnInit} from '@angular/core';
import {GlobalService} from '../../services/global.service';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';

  constructor(private service: GlobalService, private auth: AuthService, private router: Router) {
  }

  login() {
    this.service.signin(this.email, this.password).subscribe((res: any) => {
      //if user email is y@a.com' so set user to admin
      if (res.email == 'y@a.com') {
        res.role = 'admin';
      }
      res.cart= this.service.getBasket();
      this.service.emitEventOnLoggedIn();
      this.auth.setUser(res);
      this.router.navigateByUrl('home');
    },
    error => {
      alert(error.error);
    });
  }

  ngOnInit() {}
}
