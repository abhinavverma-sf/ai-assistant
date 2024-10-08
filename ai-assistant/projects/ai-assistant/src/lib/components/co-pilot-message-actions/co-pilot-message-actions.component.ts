import {Clipboard} from '@angular/cdk/clipboard';
import {Component, Input, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {MatTooltip} from '@angular/material/tooltip';
// import {TranslateService} from '@ngx-translate/core';
// import {LanguageTranslateService} from '@rao/core/localization';
// import {UserSessionStoreService} from '@rao/core/store';
import {take} from 'rxjs';

import {CoPilotMessageActions} from '../../constants';
import {
  FeedBackActions,
  FeedbackOptions,
  ReasonEnum,
} from '../../enums/feedback.enum';
import {UserFeedback} from '../../models/feedback.model';
import {CoPilotDownvoteComponent} from '../co-pilot-downvote/co-pilot-downvote.component';
import {Integers} from '../../enums/numbers.enum';
import {LocalizationPipe} from '../../pipes/localization.pipe';

@Component({
  selector: CoPilotMessageActions,
  templateUrl: './co-pilot-message-actions.component.html',
  styleUrls: [
    './co-pilot-message-actions.component.scss',
    '../../../assets/icons/icomoon/style.css',
  ],
  providers: [LocalizationPipe],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class CoPilotMessageActionsComponent {
  constructor(
    private readonly clipboard: Clipboard, // private readonly languageTranslateService: LanguageTranslateService, // private readonly toastrService: ToastrService, // private readonly deepChatFacadeSvc: DeepChatFacadeService, // private readonly storeService: UserSessionStoreService,
  ) {}

  @Input() copy: string;

  @Input() question: string;

  @Input() answer: string;

  @ViewChild('tooltip', {static: true}) tooltip: MatTooltip;

  @ViewChild('downvoteIcon') downvoteIcon;
  @ViewChild('tooltipContainer') tooltipContainer;
  @ViewChild('tooltipArrow') tooltipArrow;

  isCopied = false;

  answerUpvoted = false;

  answerDownvoted = false;

  triggerDownvotePane = false;

  currentFeedbackId;

  isDragged = false;

  disableClick = false;

  tooltipMessage = '';

  localisedStrings: {[key: string]: string} = {};

  // translate: TranslateService;

  dialogRef: MatDialogRef<CoPilotDownvoteComponent>;

  ngOnInit(): void {
    // this.translate = this.languageTranslateService.translate;
    this.getTranslationMessages();
  }

  copyClicked() {
    const textToCopy = this.convertHtmlToPlainText(this.copy);
    this.isCopied = true;
    this.tooltipMessage = this.localisedStrings['responseCopiedLbl'];

    this.clipboard.copy(textToCopy);
    this.showTooltipForDuration(Integers.OneThousandThreeHundredEighty);
  }

  convertHtmlToPlainText(html: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const textLines = Array.from(tempDiv.childNodes)
      .map(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent?.trim() ?? '';
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const text = (node as HTMLElement).innerText;
          return text?.trim() ?? '';
        } else {
          // sonar
        }

        return '';
      })
      .filter(line => line !== '');

    return textLines.join('\n');
  }

  onMouseLeave(event: MouseEvent) {
    if (!this.triggerDownvotePane) {
      this.isCopied = false;
    }
  }

  showTooltipForDuration(duration = Integers.OneThousand) {
    this.tooltip.show();

    setTimeout(() => {
      this.tooltip.hide();
      this.tooltipMessage = this.localisedStrings['copyResponseLbl'];
      this.isCopied = false;
    }, duration);
  }

  getTranslationMessages() {
    // this.translate
    //   ?.get(['copyResponseLbl', 'responseCopiedLbl', 'thanksFeedbackLbl'])
    //   .pipe(take(1))
    //   .subscribe(res => {
    //     Object.assign(this.localisedStrings, res);
    //     this.tooltipMessage = this.localisedStrings['copyResponseLbl'];
    //   });
  }

  onKeyDownCopy(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.copyClicked();
    }
  }

  upvoteClicked() {
    if (!this.answerUpvoted) {
      this.answerUpvoted = true;
      this.answerDownvoted = false;
    } else {
      this.answerUpvoted = false;
    }

    this.handleFeedback(FeedBackActions.Upvote, {
      actionType: FeedbackOptions.LIKE,
      question: this.question,
      answer: this.answer?.trim(),
    } as UserFeedback);
  }

  downvoteClicked() {
    if (!this.answerDownvoted) {
      this.answerDownvoted = true;
      this.answerUpvoted = false;
    } else {
      this.answerDownvoted = false;
    }

    if (this.answerDownvoted) {
      this.openDownvotePane();
    }
    this.handleFeedback(FeedBackActions.Downvote, {
      actionType: FeedbackOptions.DISLIKE,
      question: this.question,
      answer: this.answer?.trim(),
    } as UserFeedback);
  }

  closeDownvotePane() {
    this.triggerDownvotePane = false;
  }

  handleFeedback(action: FeedBackActions, feedback: UserFeedback): void {
    this.disableClick = true;
    switch (action) {
      case FeedBackActions.Upvote:
        this.handleUpvoteAction(feedback);
        break;

      case FeedBackActions.Downvote:
        this.handleDownvoteAction(feedback);
        break;

      case FeedBackActions.DownvoteWithReason:
        this.handleDownvoteWithReasonAction(feedback);
        break;

      default:
        break;
    }
  }

  handleUpvoteAction(feedback: UserFeedback): void {
    // user implement it
    // if (
    //   this.currentFeedbackId &&
    //   !this.answerUpvoted &&
    //   !this.answerDownvoted
    // ) {
    //   // we can de-register response also
    //   this.deepChatFacadeSvc.deleteFeedback(this.currentFeedbackId).subscribe({
    //     next: () => {
    //       this.currentFeedbackId = null;
    //       this.disableClick = false;
    //     },
    //     error: () => {
    //       this.disableClick = false;
    //     },
    //   });
    // } else if (
    //   this.currentFeedbackId &&
    //   this.answerUpvoted &&
    //   !this.answerDownvoted
    // ) {
    //   this.updateFeedbackAndCloseDownvotePane(feedback);
    // } else {
    //   this.saveFeedback(feedback);
    // }
    this.disableClick = false;
  }

  handleDownvoteAction(feedback: UserFeedback): void {
    // user implement it
    // if (
    //   this.currentFeedbackId &&
    //   !this.answerUpvoted &&
    //   !this.answerDownvoted
    // ) {
    //   // we can de-register response also
    //   this.deepChatFacadeSvc.deleteFeedback(this.currentFeedbackId).subscribe({
    //     next: () => {
    //       this.closeDownvotePane();
    //       this.currentFeedbackId = null;
    //       this.disableClick = false;
    //     },
    //     error: () => {
    //       this.disableClick = false;
    //     },
    //   });
    // } else if (
    //   this.currentFeedbackId &&
    //   this.answerDownvoted &&
    //   !this.answerUpvoted
    // ) {
    //   this.deepChatFacadeSvc
    //     .updateFeedback(this.currentFeedbackId, feedback)
    //     .subscribe({
    //       next: () => {
    //         this.disableClick = false;
    //       },
    //       error: () => {
    //         this.disableClick = false;
    //       },
    //     });
    // } else {
    //   this.saveFeedback(feedback);
    // }
    this.disableClick = false;
  }

  handleDownvoteWithReasonAction(feedback: UserFeedback): void {
    // user implement it
    // if (this.currentFeedbackId) {
    //   this.deepChatFacadeSvc
    //     .updateFeedback(this.currentFeedbackId, feedback)
    //     .subscribe({
    //       next: () => {
    //         this.toastrService.success(this.localisedStrings.thanksFeedbackLbl);
    //         this.closeDownvotePane();
    //         this.disableClick = false;
    //       },
    //       error: () => {
    //         this.disableClick = false;
    //       },
    //     });
    // }
    this.disableClick = false;
  }

  updateFeedbackAndCloseDownvotePane(feedback: UserFeedback): void {
    // user implement it
    // this.deepChatFacadeSvc
    //   .updateFeedback(this.currentFeedbackId, {
    //     ...feedback,
    //     customReason: '',
    //     reason: '' as unknown as ReasonEnum,
    //   })
    //   .subscribe({
    //     next: () => {
    //       this.closeDownvotePane();
    //       this.disableClick = false;
    //     },
    //     error: () => {
    //       this.disableClick = false;
    //     },
    //   });
    this.disableClick = false;
  }

  saveFeedback(feedback: UserFeedback): void {
    // this.deepChatFacadeSvc.saveFeedBack(feedback).subscribe({
    //   next: response => {
    //     this.currentFeedbackId = response.id;
    //     this.disableClick = false;
    //   },
    //   error: () => {
    //     this.disableClick = false;
    //   },
    // });
    // user implement it
  }

  handleDownvoteFeedback(feedback: UserFeedback): void {
    this.handleFeedback(FeedBackActions.DownvoteWithReason, {
      ...feedback,
      question: this.question,
      answer: this.answer,
    });
  }

  openDownvotePane() {
    this.triggerDownvotePane = true;
  }

  initTooltipContainer(tooltipContDetails: {
    tooltipContainer: HTMLElement;
    tooltipArrow: HTMLElement;
  }) {
    this.tooltipContainer = tooltipContDetails.tooltipContainer;
    this.tooltipArrow = tooltipContDetails.tooltipArrow;
    const downvoteIconRect =
      this.downvoteIcon.nativeElement.getBoundingClientRect();
    const tooltipContainerDimension =
      this.tooltipContainer.getBoundingClientRect();

    const finalLeft = this.calculateLeftPosition(
      downvoteIconRect,
      tooltipContainerDimension,
    );
    this.calculateTopPosition(
      downvoteIconRect,
      tooltipContainerDimension,
      finalLeft,
    );
  }

  calculateLeftPosition(
    downvoteIconRect: DOMRect,
    tooltipContainerDimension: DOMRect,
  ) {
    const rightDifference =
      tooltipContainerDimension.right - downvoteIconRect.right;
    const leftshift = tooltipContainerDimension.left - rightDifference;
    const finalLeft = leftshift + downvoteIconRect.width;

    if (finalLeft > Integers.Zero) {
      this.tooltipContainer.style.position = 'fixed';
      this.setLeftPosition(finalLeft, rightDifference);
    }
    if (finalLeft < Integers.Zero) {
      this.adjustLeftPosition(downvoteIconRect);
    }
    return finalLeft;
  }

  setLeftPosition(finalLeft: number, rightDifference: number) {
    this.tooltipContainer.style.left =
      (sessionStorage.getItem('dragged') === 'true'
        ? -rightDifference + Integers.ThirtyThree
        : finalLeft) + 'px';
  }

  adjustLeftPosition(downvoteIconRect: DOMRect) {
    this.tooltipArrow.style.left =
      downvoteIconRect.left - downvoteIconRect.width + 'px';
  }

  calculateTopPosition(
    downvoteIconRect: DOMRect,
    tooltipContainerDimension: DOMRect,
    finalLeft: number,
  ) {
    const coPilotContRect =
      document.getElementsByClassName('co-pilot-container')?.[0];
    const rect = coPilotContRect?.getBoundingClientRect();
    const finalVal = rect?.top;
    if (
      finalLeft > Integers.Zero &&
      downvoteIconRect.top >
        tooltipContainerDimension.height + Integers.OneHundred
    ) {
      let topVal =
        downvoteIconRect.top -
        tooltipContainerDimension.height -
        (sessionStorage.getItem('dragged') === 'true'
          ? finalVal
          : Integers.TwentyThree);
      if (topVal > Integers.Zero) {
        if (sessionStorage.getItem('dragged') === 'true') {
          topVal -= Integers.Twenty;
        }
        this.setTopPosition(topVal, tooltipContainerDimension);
      }
    } else if (
      finalLeft > Integers.Zero &&
      downvoteIconRect.top <=
        tooltipContainerDimension.height + Integers.OneHundred
    ) {
      let topVal = downvoteIconRect.bottom;
      if (sessionStorage.getItem('dragged') === 'true') {
        topVal = topVal - finalVal;
      }
      this.tooltipContainer.style.top = topVal + 'px';
    } else {
      // sonar
    }
  }

  setTopPosition(topVal: number, tooltipContainerDimension: DOMRect) {
    this.tooltipContainer.style.top = topVal + 'px';
    this.tooltipArrow.style.top = tooltipContainerDimension.height + 'px';
    this.tooltipArrow.style.transform = 'translateX(-50%) rotate(180deg)';
  }

  onFocusOut(event: FocusEvent) {
    this.closeDownvotePane();
  }
}
