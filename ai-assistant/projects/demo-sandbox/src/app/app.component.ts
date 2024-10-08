import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {CoPilotComponent} from 'ai-assistant';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'demo-sandbox';

  constructor(private readonly dialog: MatDialog) {}

  openDialog() {
    this.dialog.open(CoPilotComponent, {
      position: {
        top: '51.2px',
        right: '0px',
      },
      minHeight: '73vh',
      hasBackdrop: false,
      closeOnNavigation: false,
      disableClose: false,

      data: {
        sseUrl: environment.sseUrl,
      },
    });
  }
}
