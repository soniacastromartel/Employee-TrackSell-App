import { Component } from '@angular/core';
import { NO_DATA_FOUND } from '../../app.constants';

@Component({
  selector: 'app-empty-view',
  templateUrl: './empty-view.component.html',
  styleUrls: ['./empty-view.component.scss'],
})
export class EmptyViewComponent {

  // Empty data
  emptyData = NO_DATA_FOUND;

  constructor() { }

}
