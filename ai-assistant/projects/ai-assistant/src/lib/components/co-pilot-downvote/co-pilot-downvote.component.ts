import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {take} from 'rxjs';

import {FeedbackOptions, ReasonEnum} from '../../enums/feedback.enum';
import {UserFeedback} from '../../models/feedback.model';
import {Integers} from '../../enums/numbers.enum';
import {LocalizationProviderService} from '../../services';
import {CoPilotDownvote} from '../../constants';

@Component({
  selector: CoPilotDownvote,
  templateUrl: './co-pilot-downvote.component.html',
  styleUrls: ['./co-pilot-downvote.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class CoPilotDownvoteComponent {
  constructor(private readonly localizationSvc: LocalizationProviderService) {}

  @ViewChild('downvoteContainer') downvoteContainer;

  @ViewChild('downvoteInput') downvoteInput;

  localisedStrings: {[key: string]: string} = {};

  loading = true;

  @Output() tooltipClosed = new EventEmitter<void>();

  @Output() optionSelected = new EventEmitter<string>();

  @Output() tooltipContainerDetails = new EventEmitter();

  firstRowButtons = [];

  secondRowButtons = [];

  thirdRowButtons = [];

  form = new UntypedFormGroup({});

  reason;

  customReason = '';

  _subscriptions = [];

  @Input() apiInProgress = false;

  @Output() downvoteFeedback = new EventEmitter();

  ngOnInit() {
    this.getLocalizedStrings();

    this.form.addControl(
      'customReason',
      new UntypedFormControl('', [
        Validators.maxLength(Integers.TwoHundredFifty),
      ]),
    );
  }

  ngAfterViewInit(): void {
    this.tooltipContainerDetails.emit({
      tooltipContainer: this.downvoteContainer.nativeElement.offsetParent,
      tooltipArrow:
        this.downvoteContainer.nativeElement.offsetParent.firstChild,
    });

    this.focusContainer();
    this.focusInput();
  }

  focusInput() {
    if (this.downvoteInput) {
      this.downvoteInput.nativeElement.focus();
    }
  }

  focusContainer() {
    if (this.downvoteContainer) {
      this.downvoteContainer.nativeElement.focus();
    }
  }

  getLocalizedStrings() {
    this.localisedStrings = this.localizationSvc.getLocalizedStringMap();
    this.loading = false;
    this.getAllButtons();
    // this._subscriptions.push(
    //   this.translate
    //     .get([
    //       'thanksFeedbackLbl',
    //       'provideAdditionalFeedbackLbl',
    //       'misunderstoodQuestionLbl',
    //       'misleadingInformationLbl',
    //       'incompleteAnswerLbl',
    //       'offTopicResponseLbl',
    //       'notWhatIWasLookingFor',
    //       'notUseful',
    //       'otherLbl',
    //       'submitBtnText',
    //       'downvoteOptionalLbl',
    //       'downvoteMaxLengthErrLbl',
    //     ])
    //     .pipe(take(1))
    //     .subscribe(res => {
    //       Object.assign(this.localisedStrings, {...res});
    //       this.loading = false;
    //       this.getAllButtons();
    //     }),
    // );
  }

  closeTooltip() {
    this.tooltipClosed.emit();
  }

  getFirstRowButtons() {
    this.firstRowButtons = [
      {
        text: this.localisedStrings['misunderstoodQuestionLbl'],
        value: ReasonEnum.MisunderstoodQuestion,
      },
      {
        text: this.localisedStrings['misleadingInformationLbl'],
        value: ReasonEnum.MisleadingInformation,
      },
    ];
  }

  getSecondRowButtons() {
    this.secondRowButtons = [
      {
        text: this.localisedStrings['incompleteAnswerLbl'],
        value: ReasonEnum.IncompleteAnswer,
      },
      {
        text: this.localisedStrings['offTopicResponseLbl'],
        value: ReasonEnum.OffTopicResponse,
      },
    ];
  }

  getThirdRowButtons() {
    this.thirdRowButtons = [
      {
        text: this.localisedStrings['notWhatIWasLookingFor'],
        value: ReasonEnum.NotWhatIWasLookingFor,
      },
      {
        text: this.localisedStrings['notUseful'],
        value: ReasonEnum.NotUseful,
      },
      {
        text: this.localisedStrings['otherLbl'],
        value: ReasonEnum.Other,
      },
    ];
  }

  getAllButtons() {
    this.getFirstRowButtons();
    this.getSecondRowButtons();
    this.getThirdRowButtons();
  }

  handleSubmit() {
    this.customReason = this.form.get('customReason')?.value?.trim();
    this.downvoteFeedback.emit({
      actionType: FeedbackOptions.DISLIKE,
      reason: this.reason,
      customReason: this.customReason,
    } as UserFeedback);
  }

  selectOption(option) {
    this.reason = option.value;
    this.optionSelected.emit(option.value);
  }

  handleDisabled() {
    if (this.apiInProgress) {
      return true;
    }

    if (
      this.reason?.trim()?.length ||
      this.form.get('customReason').value?.trim()?.length
    ) {
      return false;
    }
    return true;
  }
}
