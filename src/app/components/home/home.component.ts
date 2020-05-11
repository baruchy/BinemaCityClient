import {AfterViewInit, Component, NgZone, OnInit} from '@angular/core';
import {ViewChild} from '@angular/core';
import {NotificationsComponent} from '../notifications/notifications.component';
import {GlobalService} from '../../services/global.service';
import {AuthService} from '../../services/auth.service';

declare var google: any;
declare var brain: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  // get referance to notification component
  @ViewChild('notification', {static: false}) notification: NotificationsComponent;
  addedSuccess = false;
  movies: any;
  searchText: '';
  searchCat: any;
  searchPrice: 0;
  mlp: any;


  alertType: string;
  alertMessage: string;
  alertClass: string;
  user: any;
  categories = [];

  constructor(private service: GlobalService, private auth: AuthService, private _zone: NgZone) {
    this.user = this.auth.getUser();
    this.service.getCategories().subscribe((res: any) => this.categories = res);
  }

  getUniqNuber() {
    return new Date().getTime();
  }

  ngOnInit() {
    const moviesHash: any = {};
    //get data for machine learning
    this.service.getMovies().subscribe((res) => {
      this.movies = res;
      let i = 1;
      this.movies.forEach((p) => {
        moviesHash[p._id] = this.getUniqNuber() + i * 15;
        p.catName = p.category.name;
        p.catId = p.category._id;
        i++;
      });
      this.mlp = this.movies[Math.floor(Math.random() * this.movies.length)];
      if (this.user && this.user._id) {
        let userMoviesPerCategory = {};
        this.service.getUserOrders(this.user._id).subscribe((orders: any) => {
          orders.forEach((o) => {
            o.movies.forEach((om) => {
              om.category = this.categories.find(c => c._id == om.category);
              if (!userMoviesPerCategory[om.category.name]) {
                userMoviesPerCategory [om.category.name] = 1;
              } else {
                userMoviesPerCategory [om.category.name]++;
              }

            });
          });

          let mostWatchedCategory = 0;
          let mostWatchedCategoryName: any = '';

          for (let [key, value] of Object.entries(userMoviesPerCategory)) {
            if (userMoviesPerCategory[key] > mostWatchedCategory) {
              mostWatchedCategory = userMoviesPerCategory[key];
              mostWatchedCategoryName = key;
            }
          }

          const userMoviesOfMostWatchCategory = [];
          orders.forEach((o) => {
            o.movies.forEach((om) => {
              if (om.category.name == mostWatchedCategoryName) {
                userMoviesOfMostWatchCategory.push(om._id);
              }
            });
          });
          const userMoviesOfMostWatchCategoryUnWAtched = this.movies.filter(m => m.category.name == mostWatchedCategoryName
            && userMoviesOfMostWatchCategory.indexOf(m._id) == -1);
          if (userMoviesOfMostWatchCategoryUnWAtched && userMoviesOfMostWatchCategoryUnWAtched.length > 0) {
            userMoviesOfMostWatchCategoryUnWAtched.sort(this.compare);
            this.mlp = userMoviesOfMostWatchCategoryUnWAtched[0];
          }
        });
      }
    });
    this.service.getLocations().subscribe((_locations: any) => {
      let geocoder;
      let map;
      const bounds = new google.maps.LatLngBounds();
      this._zone.run(() => {
        function initialize() {
          map = new google.maps.Map(
            document.getElementById('map_canvas'), {
              center: new google.maps.LatLng(37.4419, -122.1419),
              zoom: 13,
              mapTypeId: google.maps.MapTypeId.ROADMAP
            });
          geocoder = new google.maps.Geocoder();

          for (let i = 0; i < _locations.length; i++) {
            geocodeAddress(_locations, i);
          }
        }


        function geocodeAddress(locations, i) {
          const title = locations[i].location[0];
          const address = locations[i].location[1];
          const url = locations[i].location[2];
          geocoder.geocode({
              'address': locations[i].location[1]
            },
            function (results, status) {
              if (status == 'OK') {
                var marker = new google.maps.Marker({
                  icon: 'http://maps.google.com/mapfiles/ms/icons/blue.png',
                  map: map,
                  position: results[0].geometry.location,
                  title: title,
                  animation: google.maps.Animation.DROP,
                  address: address,
                  url: url
                });
                infoWindow(marker, map, title, address, url);
                bounds.extend(marker.getPosition());
                map.fitBounds(bounds);
              } else {
//              alert('geocode of ' + address + ' failed:' + status);
              }
            });
        }

        function infoWindow(marker, map, title, address, url) {
          google.maps.event.addListener(marker, 'click', function () {
            var html = '<div><h3>' + title + '</h3><p>' + address + '<br></div><a href=\'' + url + '\'>View location</a></p></div>';
            let iw = new google.maps.InfoWindow({
              content: html,
              maxWidth: 350
            });
            iw.open(map, marker);
          });
        }
        initialize();
        //google.maps.event.addDomListener(window, 'load', initialize);
      })



    });
  }

  compare(a, b) {
    if (a.orders < b.orders) {
      return 1;
    }
    if (a.orders > b.orders) {
      return -1;
    }
    return 0;
  }

  //add the Movie to the busket
  addMovie(p: any) {
    this.service.addMovieToBasket(p);
    this.addedSuccess = true;
    setTimeout(() => this.addedSuccess = false, 2000);
  }

  ngAfterViewInit() {
    //get location from the server from google map


  }

}
