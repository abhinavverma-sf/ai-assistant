/** VERY IMPORT TO LOAD DEEP CHAT */
import 'deep-chat';

import {Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
// import {environment} from '@rao/env/environment';
import {MessageContent, MessageStyles} from 'deep-chat/dist/types/messages';
import {Request} from 'deep-chat/dist/types/request';
import {CustomStyle} from 'deep-chat/dist/types/styles';
import {SubmitButtonStyles} from 'deep-chat/dist/types/submitButton';
import {TextInput} from 'deep-chat/dist/types/textInput';
import {Subscription, take} from 'rxjs';

import {
  CoPilotBase,
  CoPilotImage,
  CoPilotMessageActions,
  CoPilotRelatedTopics,
  CoPilotVideo,
} from '../../constants';
import {CoPilotRoles, NACase, NAStrings} from '../../enums';
import {IRelatedTopic} from '../../interfaces/related-topic.interface';
import {
  AnyObject,
  IStreamedResponse,
} from '../../interfaces/streamed-response.interface';
import {
  DeepChatCommsService,
  DeepChatUtilService,
  LocalizationProviderService,
} from '../../services';
import {ImageStoreService} from '../../services/image-store.service';
import {SseService} from '../../services/sse.service';
import {ChunkData, ChunkTypes} from '../../types/chunk-response.types';
import {Integers} from '../../enums/numbers.enum';
import {Signals} from 'deep-chat/dist/types/handler';
import {translationRecord} from '../../constants/localization.constant';

@Component({
  selector: CoPilotBase,
  templateUrl: './co-pilot.component.html',
  styleUrls: ['./co-pilot.component.scss'],
})
export class CoPilotComponent {
  constructor(
    protected readonly dialogRef: MatDialogRef<CoPilotComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private readonly deepChatUtilSvc: DeepChatUtilService,
    private readonly deepChatComms: DeepChatCommsService,
    private readonly sseService: SseService,
    private readonly imageStoreSvc: ImageStoreService,
    private readonly localalizationSvc: LocalizationProviderService,
  ) {
    this.getTranslationMessages();
  }

  @ViewChild('chatElementRef') chatElementRef: ElementRef;

  localisedStrings: {[key: string]: string} = {};

  textInput: TextInput = {};

  chatStyle: CustomStyle = {};

  submitButtonStyles: SubmitButtonStyles = {};

  messageStyles: MessageStyles = {};

  initialMessages: MessageContent[] = [];

  htmlString = '';

  showDeepChatComp = true;

  requestProp: Request;

  sseSubscription: Subscription;

  relatedTopics: IRelatedTopic[] = [];

  prompt = '';

  previousQuestion = '';

  previousResponse = '';

  answer = '';

  manualScrollingInProgress = false;

  manualScrollingHitsRockBottom = false;

  lastKnownScrollTop = 0;

  scrollElement: HTMLElement;
  scrollEventListener: () => void;
  wheelEventListener: (e: WheelEvent) => void;

  questionNumber = 0;

  imageCounter = 0;

  answerToCopy = '';

  _subscriptions = [];

  ngOnInit(): void {
    this._subscriptions = [];
    this.setChatConfig();
    this.imageStoreSvc.removeMap();
    sessionStorage.removeItem('dragged');
  }

  setChatConfig() {
    this.chatStyle = this.deepChatUtilSvc.getChatStyles();
    this.messageStyles = this.deepChatUtilSvc.getMessageStyles();
    this.textInput = this.deepChatUtilSvc.getTextInput(
      translationRecord.coPilotPlaceHolderLbl,
    );
    this.submitButtonStyles = this.deepChatUtilSvc.getSubmitButtonStyles();
  }

  onClose() {
    this.dialogRef.close();
  }

  getTranslationMessages() {
    this.localalizationSvc.setLocalizedStrings(translationRecord);
  }

  ngAfterViewInit(): void {
    this.chatElementRef.nativeElement.request =
      this.deepChatUtilSvc.getRequestConnection();

    if (this.chatElementRef.nativeElement.request) {
      this.chatElementRef.nativeElement.request.handler = this.handler;
      this.requestProp = this.chatElementRef.nativeElement.request;
    }
  }

  appendMessageFromIntro(messageContent: MessageContent) {
    this.chatElementRef?.nativeElement.submitUserMessage({
      text: messageContent.text,
    });
  }

  handler = (body: AnyObject, signals: Signals) => {
    this._resetVariablesOnNewQuestion();

    this.processAndHandleSse(body, signals);
    this._handleVideoScroll();
    this._handleChatScrollEvents();
  };

  /**
   * @description
   * The function `processAndHandleSse` initializes state,
   * closes the SSE connection, subscribes to SSE
   * events, and sets a stop listener.
   * @param {AnyObject} body - req body
   * @param {Signals} signals - signals to indicate Deep-Chat
   */
  processAndHandleSse(body: AnyObject, signals: Signals) {
    this._initializeState(body);

    this.sseService.closeSseConnection();
    this.disableSubmitButton();
    this._subscribeToSse(body, signals);
    this._setStopListener(signals);
  }

  resetChat() {
    this._clearSubscriptions();
    this.showDeepChatComp = false;
    this.prompt = '';
    this.previousResponse = '';
    this.answer = '';
    this.answerToCopy = '';
    this.chatElementRef.nativeElement.clearMessages();
    setTimeout(() => {
      this.showDeepChatComp = true;
    }, Integers.Zero);
  }

  private _initializeState(body: AnyObject): void {
    this.questionNumber++;
    this.previousQuestion = this.prompt;
    this.previousResponse = this.answer;
    this.prompt = body['messages'][0].text;
    this.answer = '';
    this.imageCounter = 0;
    this.answerToCopy = '';
  }

  private _subscribeToSse(body: AnyObject, signals: Signals): void {
    const sseConnectObs$ = this.sseService.connectToSse(
      {
        prompt: this.prompt,
        previousQuestion: this.previousQuestion,
        previousResponse: this.previousResponse,
      },
      this.data.sseUrl,
    );
    this.sseSubscription = sseConnectObs$.subscribe({
      next: event => {
        if (event) {
          this._handleSseEvent(event, signals);
        }
      },
      error: () => {
        this._handleError(signals, body);
        this.disableSubmitButton(false);
      },
    });

    this._subscriptions.push(this.sseSubscription);
  }

  private _handleSseEvent(event: MessageEvent, signals: Signals): void {
    try {
      const data = JSON.parse(event.data);
      const {type, chunk} = data as IStreamedResponse;

      const processedChunk = this._processChunk(type, chunk);

      if (type !== 'end') {
        this.answer += processedChunk;
      }
      this._handleEventTypes(type, chunk, signals);
    } catch (error) {
      throw new Error(`Error processing SSE event:, ${error}`);
    } finally {
      this._scrollToBottomIfNeeded();
    }
  }

  private _processChunk(type: ChunkTypes, chunk: ChunkData): string {
    if (type === 'related_topic') {
      return JSON.stringify(
        this._handleEscapeCharacters(chunk as IRelatedTopic[]),
      );
    } else {
      return (chunk as string).replace(/'/g, '&apos;');
    }
  }

  /**
   * @description
   * handle multiple variable event ranging from start of
   * stream to end of stream
   * @param type - different types of message streamed
   * @param chunk - chunked data
   * @param signals - signal to indicate Deep-Chat
   */
  private _handleEventTypes(
    type: ChunkTypes,
    chunk: ChunkData,
    signals: Signals,
  ): void {
    switch (type) {
      case 'start':
        this.disableSubmitButton(false);
        signals.onOpen();
        break;
      case 'end':
        this._endConnection(signals);
        break;
      case 'related_topic':
        this.relatedTopics = chunk as IRelatedTopic[];
        this._addRelatedTopicsComp(signals);
        break;
      case 'feature':
        this._handleFeatureType(chunk as string, signals);
        break;
      case 'NA':
        this._handleNAType(chunk as string, signals);
        break;
      case 'image':
        this._handleImageType(chunk as string, signals);
        break;
      case 'video':
        this._handleVideoType(chunk as string, signals);
        break;
      default:
        this.answerToCopy += (chunk as string).replace(/'/g, '&apos;');
        signals.onResponse({
          html: chunk as string,
          role: CoPilotRoles.AI,
        });
        break;
    }
  }

  /**
   * @description
   * extracts content with <NA4>djd</NA4> and gets back
   * to user
   * @param chunk - streamed chunk of type NA
   * @param signals - signal to indicate Deep-Chat
   */
  private _handleNA(
    chunk: string,
    signals: Signals,
    handleFeatureType = false,
  ): void {
    const regex = /<NA(\d+)>(.*?)<\/NA\1>/;
    const match = regex.exec(chunk);

    if (match) {
      const naCase = parseInt(match[1], 10);

      // Handle naCase based on whether we are processing a feature type or not
      if (naCase !== Integers.Four || handleFeatureType) {
        this._processNAContent(naCase, match, signals);
      }
    }
  }

  private _handleNAType(chunk: string, signals: Signals): void {
    this._handleNA(chunk, signals, false);
  }

  private _handleFeatureType(chunk: string, signals: Signals): void {
    this._handleNA(chunk, signals, true);
  }

  private _processNAContent(
    naCase: number,
    match: RegExpMatchArray,
    signals: Signals,
  ) {
    const naContent = this._getNAContent(
      naCase,
      match,
      // environment.featureRequestORBugReportURL,
      '',
    );

    this.answerToCopy += naContent;

    signals.onResponse({
      html: naContent,
      role: CoPilotRoles.AI,
    });
  }

  /**
   * @description
   * extracts the file b/w <image>48383_png.png</image>
   * tag and sends to image component
   * @param chunk - streamed chunk of type image
   * @param signals - signal to indicate Deep-Chat
   */
  private _handleImageType(chunk: string, signals: Signals): void {
    const imageUrlRegex = /<image>(.*?)<\/image>/gs;
    const match = imageUrlRegex.exec(chunk);
    if (match?.[1]) {
      signals.onResponse({
        html: `<${CoPilotImage} filekey='${match[1]}' 
        imagecounter='${this.imageCounter}'
         numquestion='${this.questionNumber}'></${CoPilotImage}>`,
        role: CoPilotRoles.AI,
      });
      this.imageCounter++;
    }
  }

  /**
   * @description
   * extracts the fileKey or content within <video>48348_mp4.mp4</video>
   * tag and sends to video component
   * @param chunk - streamed chunk of type video
   * @param signals - signal to indicate Deep-Chat
   */
  private _handleVideoType(chunk: string, signals: Signals): void {
    const videoUrlRegex = /<video>(.*?)<\/video>/gs;
    const match = videoUrlRegex.exec(chunk);
    if (match?.[1]) {
      signals.onResponse({
        html: `<${CoPilotVideo} videofilekey='${match[1]}'></${CoPilotVideo}>`,
        role: CoPilotRoles.AI,
      });
    }
  }

  private _handleError(signals: Signals, body: AnyObject): void {
    this.processAndHandleSse(body, signals);
  }

  private _setStopListener(signals: Signals): void {
    signals.stopClicked.listener = () => {
      this._endConnection(signals);
    };
  }

  /**
   * @description
   * 1. changes the stop icon back to send icon
   * 2. connection of sse is now broken
   * 3. add back feedback component
   * @param signals
   */
  private _endConnection(signals: Signals) {
    if (this.answer.trim().length) {
      this._addFeedbackComp();
    }

    this._restoreScrollPositionIfNeeded();
    this.sseService.closeSseConnection();
    this.sseSubscription.unsubscribe();

    signals.onClose();
  }

  /**
   * @description
   * handles scroll and wheel event listener so as user
   * can scroll along when answer is being printed/streamed
   *
   */
  private _handleChatScrollEvents(): void {
    this.scrollElement =
      this.chatElementRef?.nativeElement?._elementRef?.firstElementChild?.firstElementChild;

    if (!this.scrollElement) {
      return;
    }

    this.scrollEventListener = () => {
      if (this.manualScrollingInProgress) {
        // Handle scroll event
        if (
          this.scrollElement.clientHeight + this.scrollElement.scrollTop >=
          this.scrollElement.scrollHeight
        ) {
          this._handleManualScrollToBottom();
        }
      }
    };

    this.wheelEventListener = (e: WheelEvent) => {
      // Handle wheel event
      this.lastKnownScrollTop = this.scrollElement.scrollTop;

      if (this.scrollElement.scrollHeight > this.scrollElement.clientHeight) {
        if (this.manualScrollingHitsRockBottom) {
          this.manualScrollingInProgress = false;
        } else {
          this.manualScrollingInProgress = true;
        }
      }

      if (
        this.lastKnownScrollTop <
        this.scrollElement.scrollHeight - this.scrollElement.clientHeight
      ) {
        this.manualScrollingHitsRockBottom = false;
      }
    };

    const options = {passive: true};

    this.scrollElement.addEventListener(
      'scroll',
      this.scrollEventListener,
      options,
    );
    this.scrollElement.addEventListener(
      'wheel',
      this.wheelEventListener,
      options,
    );
  }

  private _clearSubscriptions() {
    this._subscriptions.forEach(subscription => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });

    this._subscriptions = [];
  }

  private _addRelatedTopicsComp(signals: Signals) {
    this.relatedTopics = this._handleEscapeCharacters(this.relatedTopics);
    if (Array.isArray(this.relatedTopics) && this.relatedTopics.length) {
      signals.onResponse({
        html: `<${CoPilotRelatedTopics}
        items='${JSON.stringify(this.relatedTopics)}'
        ></${CoPilotRelatedTopics}>`,
        role: CoPilotRoles.AI,
      });
    }
  }

  /**
   * @description apostrophe character to be replaced with
   * html character apos
   * @param data - array of objects of related topics
   * @returns array of {IRelatedTopic}
   */
  private _handleEscapeCharacters(data: IRelatedTopic[]): IRelatedTopic[] {
    return data.map(entry => {
      return {
        ...entry,
        name: entry.name.replace(/'/g, '&apos;'),
      };
    });
  }

  private _addFeedbackComp() {
    this.chatElementRef.nativeElement._addMessage({
      html: `<${CoPilotMessageActions} question='${this.prompt}'
      copy='${this.answerToCopy}'
       answer='${this.answer}'></${CoPilotMessageActions}>`,
      role: CoPilotRoles.FEEDBACK,
      text: null,
    });
  }

  private _restoreScrollPositionIfNeeded(): void {
    if (this.manualScrollingInProgress) {
      this.chatElementRef.nativeElement._elementRef.firstElementChild.firstElementChild.scrollTop =
        this.lastKnownScrollTop;
    }
  }

  private _setScrollTopForVideo(videoScrollTop: number) {
    setTimeout(() => {
      this.chatElementRef.nativeElement._elementRef.firstElementChild.firstElementChild.scrollTop =
        videoScrollTop;
    }, Integers.Zero);
  }

  private _scrollToBottomIfNeeded(): void {
    if (!this.manualScrollingInProgress) {
      this._nativeScrollToBottom();
    }
  }

  private _resetVariablesOnNewQuestion() {
    this.manualScrollingInProgress = false;

    this.manualScrollingHitsRockBottom = false;

    this.lastKnownScrollTop = 0;
  }

  private _handleManualScrollToBottom(): void {
    this._nativeScrollToBottom();
    this.manualScrollingInProgress = false;
    this.manualScrollingHitsRockBottom = true;
  }

  private _nativeScrollToBottom() {
    this.chatElementRef.nativeElement.scrollToBottom();
  }

  ngOnDestroy(): void {
    if (this.scrollElement) {
      this.scrollElement.removeEventListener(
        'scroll',
        this.scrollEventListener,
      );
      this.scrollElement.removeEventListener('wheel', this.wheelEventListener);
    }
  }

  private _handleVideoScroll() {
    const videoScrollSubscription$ = this.deepChatComms
      .onVideoScrollPosition()
      ?.subscribe(res => {
        if (res) {
          this._setScrollTopForVideo(res);
        }
      });
    this._subscriptions.push(videoScrollSubscription$);
  }

  /**
   * @description
   * finds the partcular not applicable case and returns the corresponding
   * string from enum
   * @param naCase - type of not applicable case
   * @param match - regex
   * @param featureRequestURL - bug report link
   * @returns string content to show on UI
   */
  private _getNAContent(
    naCase: number,
    match: RegExpMatchArray,
    featureRequestURL: string,
  ): string {
    if (naCase === parseInt(NACase.NA3)) {
      return NAStrings.nA3(match[2].trim(), featureRequestURL);
    } else {
      return NAStrings[`nA${naCase}`] || '';
    }
  }

  disableSubmitButton(disable = true) {
    this.chatElementRef.nativeElement.disableSubmitButton(disable);
  }
}
