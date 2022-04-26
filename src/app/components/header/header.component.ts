import { Component, Input } from '@angular/core';
import { FAQ, LOGO_PATH } from '../../app.constants';
import { FaqComponent } from '../faq/faq.component';
import { NotificationsService } from '../../services/notifications.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent{
@Input() title: string;

// Logo Icot header
logo = LOGO_PATH;
// Icon FAQ header
faq = FAQ;

constructor(private noti: NotificationsService) { }

  // Open FAQ App
    openFAQ() {
    this.noti.pageSvc.openFAQ(FaqComponent, true);
  }
}
