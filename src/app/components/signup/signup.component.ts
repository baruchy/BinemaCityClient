import {Component, OnInit} from '@angular/core';
import {GlobalService} from "../../services/global.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
    email = '';
    password = '';

    genders = ['Male', 'Female'];
    gender = this.genders[0];

    signup() {
        this.service.signup(this.email, this.password, this.gender).subscribe(resp => {
            this.router.navigateByUrl('login');
        },
        error => {
            alert(error.error);
        });
    }

    constructor(private service: GlobalService, private router: Router) {
    }

    ngOnInit() {
    }

}
