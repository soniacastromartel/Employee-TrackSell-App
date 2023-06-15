import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonTabs, Platform } from '@ionic/angular';


@Component({
  selector: 'app-rankings',
  templateUrl: './rankings.page.html',
  styleUrls: ['./rankings.page.scss'],
})
export class RankingsPage implements OnInit {

  constructor(private platform: Platform, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit() {
  }

  tabChanged($event: any) {
    console.log($event);
    // Get the selected tab's ID from the event
    const selectedTabId = $event.tab;
    if (selectedTabId === 'mi-centro') {
      // Reload content for 'mi-centro' tab
      this.reloadMiCentroContent();
    } else if (selectedTabId === 'grupo') {
      // Reload content for 'grupo' tab
      this.reloadGrupoContent();
    }
  }

  reloadMiCentroContent() {
    // Perform content reloading actions for 'mi-centro' tab
  }

  reloadGrupoContent() {
    // Perform content reloading actions for 'grupo' tab
  }





}
