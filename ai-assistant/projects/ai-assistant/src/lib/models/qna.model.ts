export class Qna {
  prompt: string;
  previousQuestion?: string;
  previousResponse?: string;

  constructor(data?: Partial<Qna>) {
    this.prompt = data?.prompt ?? '';
    this.previousQuestion = data?.previousQuestion;
    this.previousResponse = data?.previousResponse;
  }
}
