import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-refresher',
  templateUrl: './refresher.component.html',
  styleUrls: ['./refresher.component.scss']
})
export class RefresherComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  handleRefresh(event) {
    setTimeout(() => {
      this.ngOnInit();
      // Any calls to load data go here
      event.target.complete();
    }, 2000);
  }

}
