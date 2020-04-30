import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Injectable()
export class AuthService {
    constructor(private http: HttpClient) {}

    setUser(user: any) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    getUser() {
        if (localStorage.user) {
            return JSON.parse(localStorage.getItem('user'));
        }
        return null;
    }
}
