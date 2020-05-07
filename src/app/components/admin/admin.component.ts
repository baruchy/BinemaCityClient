import {Component, OnInit} from '@angular/core';
import {GlobalService} from '../../services/global.service';

declare var $: any;
//declare var d3: any;

import * as d3 from 'd3';
import * as d3Scale from 'd3-scale';

import * as d3Shape from 'd3-shape';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private service: GlobalService) {
  }

  //set private memebers
  newCat = {
    name: ''
  };

  newMovie = {
    name: '',
    price: '',
    category: '',
    image: ''
  };

  newUser = {
    email: '',
    password: '',
    gender: ''
  };
  genders = ['Male', 'Female'];

  searchText: '';
  searchCat: any;
  searchPrice: 0;
  categories: any;
  movies: any;
  users: any;
  selectedCat: any;
  selctedMovie: any;
  selectedUser: any;


  private width: number;
  private height: number;
  private margin = {top: 20, right: 20, bottom: 30, left: 40};

  private x: any;
  private y: any;
  private svg: any;
  private g: any;

  private radius: number;

  private arc: any;
  private pie: any;
  private color: any;

  data: any = [];
  searchEmail: any;
  searchPassword: any;
  searchGender: any;

  ngOnInit() {
    $('.modal').hide();
    $('.modal-backdrop').remove();

    //get initial data for the screen
    this.initData();

  }

  private initData() {
    this.initCategories();
    this.initMovies();
    this.initUsers();
  }

  private initCategories() {
    this.service.getCategories().subscribe((res) => {
      this.categories = res;
    });
  }

  private initMovies() {
    this.service.getMovies().subscribe((res) => {
      this.movies = res;
      this.movies.forEach((p) => {
        p.catName = p.category.name;
      });
    });
  }

  private initUsers() {
    this.service.getUsers().subscribe((res) => {
      this.users = res;
    });
  }

  private closePopups() {
    document.getElementsByName("closeModalButton").forEach(button => button.click());
  }

  ngAfterContentInit() {
    // get data for the charts
    this.setupCharts();
    this.initCharts();

  }

  // init the chart of gender
  private initSvg() {
    this.svg = d3.select('svg#byGender');

    this.width = +this.svg.attr('width');
    this.height = +this.svg.attr('height');
    this.radius = Math.min(this.width, this.height) / 2;

    this.color = d3Scale.scaleOrdinal()
      .range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00']);

    this.arc = d3Shape.arc()
      .outerRadius(this.radius - 10)
      .innerRadius(this.radius - 70);

    this.pie = d3Shape.pie()
      .sort(null)
      .value((d: any) => d.count);

    this.svg = d3.select('svg#byGender')
      .append('g')
      .attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ')');
  }

  private drawChart(data: any[]) {
    let g = this.svg.selectAll('.arc')
      .data(this.pie(data))
      .enter().append('g')
      .attr('class', 'arc');

    g.append('path')
      .attr('d', this.arc)
      .style('fill', d => this.color(d.data._id));

    g.append('text')
      .attr('transform', d => 'translate(' + this.arc.centroid(d) + ')')
      .attr('dy', '.35em')
      .text(d => d.data.count + ' - ' + d.data._id);
  }


// CATEGORIES
  selectCat(cat: any) {
    this.selectedCat = cat;
  }

  createCat() {
    this.service.createCategories(this.newCat).subscribe((res) => {
      this.initData();
      this.closePopups();
      },
      error => {
        alert(error.error);
      });
  }

  updateCategory() {
    this.service.updateCategory(this.selectedCat).subscribe((res) => {
      this.initData();
      this.closePopups();
      },
      error => {
        alert(error.error);
      });
  }

  // Movies
  selectMovie(p: any) {
    this.selctedMovie = p;
  }

  deleteMovie(p: any) {
    this.service.deleteMovies(p).subscribe((res) => {
      this.initData();
      this.closePopups();
      },
      error => {
        alert(error.error);
      });
  }

  createMovie() {
    if (!this.newMovie.category) {
      alert('Please select category');
      return false;
    }
    this.service.createMovies(this.newMovie).subscribe((res) => {
      this.initData();
      this.closePopups();
    },
      error => {
        alert(error.error);
      });
  }

  updateMovie() {
    this.service.updateMovies(this.selctedMovie).subscribe((res) => {
      this.initData();
      this.closePopups();
    },
      error => {
        alert(error.error);
      });
  }

  // USERS
  selectUser(u: any) {
    this.selectedUser = u;
  }

  createUser() {
    this.service.createUser(this.newUser).subscribe((res) => {
      this.initData();
      this.closePopups();
    },
      error => {
        alert(error.error);
      });
  }

  updateUser() {
    this.service.updateUser(this.selectedUser).subscribe((res) => {
      this.initData();
      this.closePopups();
    },
      error => {
        alert(error.error);
      });
  }


  private initCharts() {
    this.service.groupByGender().subscribe((res) => {
      this.data = res;
      this.initSvg();
      this.drawChart(this.data);
    });
  }

  private setupCharts() {
    this.service.getCategories().subscribe((cats: any) => {
      this.service.getMoviebycat().subscribe((res: any) => {
        var data = [];
        if (res) {

          res.forEach((r) => {
            let cat = cats.find((c) => {
              return c._id.toString() == r._id.toString();
            });

            data.push({name: cat.name, count: r.count});
          });
        }
        var svg = d3.select('svg'),
          width = parseInt(svg.attr('width')),
          height = parseInt(svg.attr('height')),
          radius = Math.min(width, height) / 2;

        var g = svg.append('g')
          .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

        var color = d3.scaleOrdinal(['#4daf4a', '#377eb8', '#ff7f00', '#984ea3', '#e41a1c']);

        var pie = d3.pie().value(function(d: any) {
          return d.count;
        });

        var path: any = d3.arc()
          .outerRadius(radius - 10)
          .innerRadius(0);

        var label = d3.arc()
          .outerRadius(radius)
          .innerRadius(radius - 80);

        var arc = g.selectAll('.arc')
          .data(pie(data))
          .enter().append('g')
          .attr('class', 'arc');

        arc.append('path')
          .attr('d', path)
          .attr('fill', function(d: any) {
            return color(d.data.name);
          });

        arc.append('text')
          .attr('transform', function(d: any) {
            return 'translate(' + label.centroid(d) + ')';
          })
          .text(function(d: any) {
            return d.data.name;
          });

        svg.append('g')
          .attr('transform', 'translate(' + (width / 2 - 120) + ',' + 20 + ')')
          .append('text')
          .attr('class', 'title');
      });
    });
  }
}
