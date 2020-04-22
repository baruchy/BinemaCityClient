import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable()
export class GlobalService {

  onMovieAddCallback: Subject<any> = new Subject<any>();
  onMovieAddCallback$ = this.onMovieAddCallback.asObservable();

  onUserLoggedCallback: Subject<any> = new Subject<any>();
  onUserLoggedCallback$ = this.onUserLoggedCallback.asObservable();

  onUserUnLoggedCallback: Subject<any> = new Subject<any>();
  onUserUnLoggedCallback$ = this.onUserUnLoggedCallback.asObservable();

  onRefreshCallback: Subject<any> = new Subject<any>();
  onRefreshCallback$ = this.onRefreshCallback.asObservable();

  onClearBusketCallback: Subject<any> = new Subject<any>();
  onClearBusketCallback$ = this.onClearBusketCallback.asObservable();

  private socket: io.Socket; // The client instance of socket.io

  private moviesInBusket: any = {
    movies: [],
    total: 0
  };

  numOfusers = '0';

  constructor(private http: HttpClient, public router: Router) {
    this.socket = io('http://localhost:3000/');

    this.socket.on('userLoggedIn', (numOfusers: any) => {
      this.onUserLoggedCallback.next(numOfusers);
    });
    this.socket.on('userLoggedOut', (numOfusers: any) => {
      this.onUserUnLoggedCallback.next(numOfusers);
    });

    this.socket.on('onRefresh', (numOfusers: any) => {
      this.onRefreshCallback.next(numOfusers);
    });
  }

  getBasket() {
    return this.moviesInBusket;
  }

  getNumOfUsers() {
    return this.numOfusers;
  }

  clearBusket() {    
    this.moviesInBusket.movies = [];
    this.moviesInBusket.total = 0;
    this.onClearBusketCallback.next();
  }

  removeFromBusket(p: any) {
	this.moviesInBusket.movies = this.moviesInBusket.movies.filter(movie => movie != p);
    this.moviesInBusket.total = this.getTotalBasket();
    this.onMovieAddCallback.next(this.moviesInBusket);
  }

  addMovieToBasket(p) {
    let founded = this.moviesInBusket.movies.find(fp => fp._id.toString() == p._id.toString());

    if (founded) {
      founded.count++;
    } else {
      p.count = 1;
      this.moviesInBusket.movies.push(p);
    }

    this.moviesInBusket.totalItems = this.getTotalItemsBasket();
    this.moviesInBusket.total = this.getTotalBasket();
    this.onMovieAddCallback.next(this.moviesInBusket);
  }

  private getTotalItemsBasket() {
    let sum = 0;
    this.moviesInBusket.movies.forEach((bp) => {
      sum += bp.count;
    });
    return sum;
  }

  private getTotalBasket() {
    let sum = 0;
    this.moviesInBusket.movies.forEach((bp: any) => {
      sum += bp.price * bp.count;
    });
    return sum;
  }

  //AUTHENTICATION
  signup(email, password, gender) {

    var data = {email: email, password: password, gender: gender};
    return this.http.post('http://localhost:3000/api/register', data);

  }

  signin(email, password) {

    var data = {email: email, password: password};
    return this.http.post('http://localhost:3000/api/login', data);
  }

  logOut() {
    localStorage.removeItem('user');
    this.router.navigateByUrl('login');
    this.clearBusket();
    this.emitEventOnLoggedOut();
  }

  // CATEGORIES
  getCategories() {
    return this.http.get('http://localhost:3000/api/categories');
  }

  createCategories(c: any) {
    return this.http.post('http://localhost:3000/api/categories', c);
  }

  updateCategory(c: any) {
    return this.http.put('http://localhost:3000/api/categories/' + c._id, c);
  }

  deleteCategories(c: any) {
    return this.http.delete('http://localhost:3000/api/categories/' + c._id, c);
  }


  //movies
  getMovies() {
    return this.http.get('http://localhost:3000/api/movies');
  }

  createMovies(c: any) {
    return this.http.post('http://localhost:3000/api/movies', c);
  }

  updateMovies(c: any) {
    return this.http.put('http://localhost:3000/api/Movies/' + c._id, c);
  }

  deleteMovies(c: any) {
    return this.http.delete('http://localhost:3000/api/Movies/' + c._id, c);
  }


  //USERS
  getUsers() {
    return this.http.get('http://localhost:3000/api/Users');
  }

  getUserOrders(id: any) {
    return this.http.get('http://localhost:3000/api/Users/' + id + '/orders');
  }

  createUser(c: any) {
    return this.http.post('http://localhost:3000/api/Users', c);
  }

  updateUser(c: any) {
    return this.http.put('http://localhost:3000/api/Users/' + c._id, c);
  }

  deleteUser(c: any) {
    return this.http.delete('http://localhost:3000/api/Users/' + c._id, c);
  }

  //ORDERS
  getOrders(id) {
    return this.http.get('http://localhost:3000/api/Orders/');
  }

  createOrders(c: any) {
    return this.http.post('http://localhost:3000/api/Orders', c);
  }

  updateOrders(c: any) {
    return this.http.put('http://localhost:3000/api/Orders/' + c._id, c);
  }

  deleteOrders(c: any) {
    return this.http.delete('http://localhost:3000/api/Orders/' + c._id, c);
  }

  getBitcoinRate() {
    return this.http.get('https://api.coindesk.com/v1/bpi/currentprice.json');

  }

  getMoviebycat() {
    return this.http.get('http://localhost:3000/api/movieByCategory');
  }

  getLocations() {
    return this.http.get('http://localhost:3000/api/maps');
  }

  getMlProduct(userId) {
    return this.http.get('http://localhost:3000/api/users/' + userId + '/getml');
  }

//Gte the chart data by gender
  groupByGender() {
    return this.http.get('http://localhost:3000/api/groupByGender');
  }

//SOCKET EMITTERS
  emitOnRefresh() {
    this.socket.emit('onRefresh');
  }

  emitEventOnLoggedIn() {
    this.socket.emit('userLoggedIn');
  }

  emitEventOnLoggedOut() {
    this.socket.emit('userLoggedOut');
  }
}
