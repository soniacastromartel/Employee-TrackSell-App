import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { DASHBOARD } from 'src/app/app.constants';


@Component({
  selector: 'app-health-services',
  templateUrl: './health-services.page.html',
  styleUrls: ['./health-services.page.scss'],
})
export class HealthServicesPage implements OnInit {
  private tab: string;

  constructor(private location: Location, private route: Router) {
    this.tab = 'services';
  }

  ngOnInit() {
  }

  tabChanged($event: any) {
    this.tab = $event.tab;
    if (this.tab === 'services') {
    } else if (this.tab === 'centres') {
    }
  }

  goBack() {
    if (this.tab === 'services') {
      this.route.navigate([DASHBOARD]);
    } else {
      this.location.back();
    }
  }

}
