import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {

      //set the canvas
      let c:any = document.getElementById("myCanvas");
      let ctx = c.getContext("2d");
      ctx.font = "30px Arial";
      ctx.fillText("Binema City", 10, 50);
  }

}
