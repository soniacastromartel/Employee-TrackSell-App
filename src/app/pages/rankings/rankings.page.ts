import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UtilsService } from 'src/app/services/utils.service';



@Component({
  selector: 'app-rankings',
  templateUrl: './rankings.page.html',
  styleUrls: ['./rankings.page.scss'],
})
export class RankingsPage implements OnInit {

  constructor(private location: Location, private utils: UtilsService) {

  }

  ngOnInit() {
  }

  tabChanged($event: any) {
    console.log($event);
    // Get the selected tab's ID from the event
    const selectedTabId = $event.tab;
    if (selectedTabId === 'mi-centro') {
      this.reloadMiCentroContent();
    } else if (selectedTabId === 'grupo') {
      this.reloadGrupoContent();
    }
  }

  reloadMiCentroContent() {
    // Perform content reloading actions for 'mi-centro' tab
  }

  reloadGrupoContent() {
    // Perform content reloading actions for 'grupo' tab
  }


  goBack() {
    this.location.back();
  }


 


}
