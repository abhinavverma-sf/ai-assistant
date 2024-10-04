import {Component, EventEmitter, Output} from '@angular/core';
import {LocalizationPipe} from '../../pipes/localization.pipe';
// import {UserSessionStoreService} from '@rao/core/store';

@Component({
  selector: 'rpms-co-pilot-header',
  templateUrl: './co-pilot-header.component.html',
  styleUrls: ['./co-pilot-header.component.scss'],
  providers: [LocalizationPipe],
})
export class CoPilotHeaderComponent {
  @Output() closeDialog = new EventEmitter();

  @Output() resetChatEmit = new EventEmitter();

  @Output() openHistoryComp = new EventEmitter();

  // constructor(private readonly storeService: UserSessionStoreService) {

  // }

  onClose() {
    this.closeDialog.emit();
  }

  openHistory() {
    this.openHistoryComp.emit();
  }

  resetChat() {
    this.resetChatEmit.emit();
  }

  onDragEnded($event) {
    // this.storeService.setCoPilotCompDragged(true);
  }
}
