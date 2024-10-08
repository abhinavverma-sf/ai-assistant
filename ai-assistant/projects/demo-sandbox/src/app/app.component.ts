import {Component} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {CoPilotComponent} from 'ai-assistant';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'demo-sandbox';

  dialogRef: MatDialogRef<CoPilotComponent>;

  constructor(private readonly dialog: MatDialog) {}

  openDialog() {
    this.closePreviousDialogIfOpen();
    this.dialogRef = this.dialog.open(CoPilotComponent, {
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

  closePreviousDialogIfOpen() {
    if (this.dialogRef?.componentInstance) {
      // Close the previous dialog if it's open
      this.dialogRef.close();
      this.dialogRef = null;
    }
  }
}
