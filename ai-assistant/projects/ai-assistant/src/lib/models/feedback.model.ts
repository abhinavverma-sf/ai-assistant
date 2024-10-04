import {FeedbackOptions, ReasonEnum} from '../enums/feedback.enum';

export class UserFeedback {
  question: string;
  answer: string;
  actionType: FeedbackOptions;
  reason: ReasonEnum;
  customReason?: string;

  constructor(data?: Partial<UserFeedback>) {
    this.question = data?.question ?? '';
    this.answer = data?.answer ?? '';
    this.actionType = data?.actionType ?? FeedbackOptions.LIKE;
    this.reason = data?.reason ?? ReasonEnum.Other;
    this.customReason = data?.customReason;
  }
}
