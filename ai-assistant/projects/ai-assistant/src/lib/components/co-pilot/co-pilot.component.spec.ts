import {HttpClientModule} from '@angular/common/http';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {AnyAdapter, ApiService} from '@rao/core/api';
import {AuthService, User} from '@rao/core/auth';
import {CurrentUserAdapter} from '@rao/core/auth/adapters';
import {AnyObject} from '@rao/core/backend-filter';
import {Integers} from '@rao/core/enums';
import {LanguageTranslateService} from '@rao/core/localization';
import {IdService} from '@rao/core/services';
import {UserSessionStoreService} from '@rao/core/store';
import {Signals} from 'deep-chat/dist/types/handler';
import {MessageContent} from 'deep-chat/dist/types/messages';
import {of} from 'rxjs';

import {NAStrings} from '../../enums';
import {DeepChatFacadeService, MessageFacadeService} from '../../facades';
import {
  DeepChatCommsService,
  DeepChatUtilService,
  ResponseHtmlParserService,
} from '../../services';
import {ImageStoreService} from '../../services/image-store.service';
import {SseService} from '../../services/sse.service';
import {CoPilotComponent} from './co-pilot.component';
import {environment} from '@rao/env/environment';

describe('CoPilotComponent', () => {
  let component: CoPilotComponent;
  let fixture: ComponentFixture<CoPilotComponent>;
  let userSessionStoreServiceSpy: jasmine.SpyObj<UserSessionStoreService>;
  let idServiceSpy: jasmine.SpyObj<IdService>;
  let messageFacadeSpy: jasmine.SpyObj<MessageFacadeService>;
  let translateServiceSpy: jasmine.SpyObj<TranslateService>;
  let deepChatUtilSvcSpy: jasmine.SpyObj<DeepChatUtilService>;
  let deepChatFacadeSpy: jasmine.SpyObj<DeepChatFacadeService>;
  let deepChatCommsSvcSpy: jasmine.SpyObj<DeepChatCommsService>;
  let responseParserSvcSpy: jasmine.SpyObj<ResponseHtmlParserService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let sseServiceSpy: jasmine.SpyObj<SseService>;

  let imageStoreSvcSpy: jasmine.SpyObj<ImageStoreService>;

  const signals: Signals = {
    onOpen: jasmine.createSpy('onOpen'),
    onResponse: jasmine.createSpy('onResponse'),
    onClose: jasmine.createSpy('onClose'),
    stopClicked: {
      listener: () => {
        throw new Error('Function not implemented.');
      },
    },
    newUserMessage: {
      listener: (body: AnyObject) => {
        throw new Error('Function not implemented.');
      },
    },
  };

  beforeEach(async () => {
    userSessionStoreServiceSpy = jasmine.createSpyObj(
      'UserSessionStoreService',
      ['getUser', 'getAccessToken'],
    );
    userSessionStoreServiceSpy.getUser.and.returnValue(
      new User({
        userTenantId: 'utid',
      }),
    );
    idServiceSpy = jasmine.createSpyObj('IdService', ['getId']);
    messageFacadeSpy = jasmine.createSpyObj('MessageFacadeService', [
      'createMessage',
      'getMessages',
    ]);

    translateServiceSpy = jasmine.createSpyObj('TranslateService', ['get']);
    translateServiceSpy.get.and.returnValue(of(true));

    deepChatUtilSvcSpy = jasmine.createSpyObj('DeepChatUtilService', [
      'getChatStyles',
      'getMessageStyles',
      'getInputStyles',
      'getTextInput',
      'getRequestConnection',
      'getSubmitButtonStyles',
    ]);

    deepChatFacadeSpy = jasmine.createSpyObj('DeepChatFacadeService', [
      'sendQuestion',
    ]);

    deepChatCommsSvcSpy = jasmine.createSpyObj('DeepChatCommsService', [
      'receiveTrigger',
      'onVideoScrollPosition',
    ]);

    responseParserSvcSpy = jasmine.createSpyObj('ResponseHtmlParserService', [
      'replaceMarkers',
    ]);

    authServiceSpy = jasmine.createSpyObj('AuthService', ['refreshToken']);
    authServiceSpy.refreshToken.and.returnValue(of());

    sseServiceSpy = jasmine.createSpyObj('SseService', ['connectToSse']);

    imageStoreSvcSpy = jasmine.createSpyObj('ImageStoreService', ['removeMap']);

    await TestBed.configureTestingModule({
      declarations: [CoPilotComponent],
      imports: [MatDialogModule, TranslateModule.forRoot(), HttpClientModule],
      providers: [
        {provide: MatDialogRef, useValue: {}},
        {provide: MAT_DIALOG_DATA, useValue: []},
        {
          provide: UserSessionStoreService,
          useValue: userSessionStoreServiceSpy,
        },
        {provide: IdService, useValue: idServiceSpy},
        {
          provide: MessageFacadeService,
          userValue: messageFacadeSpy,
        },
        {provide: LanguageTranslateService, useValue: {}},
        {provide: TranslateService, useValue: translateServiceSpy},
        {provide: DeepChatUtilService, useValue: deepChatUtilSvcSpy},
        ResponseHtmlParserService,
        ApiService,
        AnyAdapter,
        {
          provide: DeepChatFacadeService,
          useValue: deepChatFacadeSpy,
        },
        {
          provide: DeepChatCommsService,
          useValue: deepChatCommsSvcSpy,
        },
        CurrentUserAdapter,
        {provide: AuthService, useValue: authServiceSpy},
        {provide: SseService, useValue: sseServiceSpy},
        {provide: ImageStoreService, useValue: imageStoreSvcSpy},
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoPilotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set textInput correctly', () => {
    deepChatUtilSvcSpy.getTextInput.and.returnValue({
      placeholder: {
        text: 'mockTextInput',
      },
    });

    component.setChatConfig();

    expect(component.textInput.placeholder.text).toBe('mockTextInput');
  });

  it('should set inputAreaStyle and message style correctly', () => {
    const mockMessageStyle = {
      html: {
        ai: {
          bubble: {
            opacity: '0',
          },
        },
      },
    };
    deepChatUtilSvcSpy.getMessageStyles.and.returnValue({
      html: {
        ai: {
          bubble: {
            opacity: '0',
          },
        },
      },
    });

    component.setChatConfig();

    expect(component.messageStyles).toEqual(mockMessageStyle);
  });

  it('should set automation ID attribute for deep-chat component', () => {
    const deepChatElement: HTMLElement =
      fixture.nativeElement.querySelector('#deep-chat');

    const automationId = deepChatElement.getAttribute('automation-id');

    expect(automationId).toBe('deep-chat-co-pilot');
  });

  it('should send a question and process the response', () => {
    component.previousQuestion = '';
    component.previousResponse = `{"output":"Response text"}`;
    const reqBody: AnyObject = {
      messages: [{text: 'Question text'}],
    };

    deepChatFacadeSpy.sendQuestion.and.returnValue(
      of({output: 'Response text'}),
    );

    component['_initializeState'](reqBody);

    sseServiceSpy.connectToSse.and.returnValue(of());

    responseParserSvcSpy.replaceMarkers.and.returnValue('Processed response');

    component['_subscribeToSse'](reqBody, signals);

    expect(sseServiceSpy.connectToSse).toHaveBeenCalledWith({
      prompt: 'Question text',
      previousQuestion: component.previousQuestion,
      previousResponse: component.previousResponse,
    });
  });

  it('should submit user message to chat element if chatElementRef is defined', () => {
    const messageContent: MessageContent = {text: 'Test message'};
    spyOn(component.chatElementRef.nativeElement, 'submitUserMessage');

    component.appendMessageFromIntro(messageContent);

    expect(
      component.chatElementRef.nativeElement.submitUserMessage,
    ).toHaveBeenCalledWith({text: 'Test message'});
  });

  it('should trigger clearMessages when reset chat method is called', () => {
    const clearMessagesSpy = spyOn(
      component.chatElementRef.nativeElement,
      'clearMessages',
    );

    component.resetChat();

    expect(clearMessagesSpy).toHaveBeenCalled();
    expect(component.answerToCopy).toEqual('');
    expect(component.prompt).toEqual('');
    expect(component.previousResponse).toEqual('');
    expect(component.answer).toEqual('');
  });

  it('should process chunk effectively and handle apostrophe characters', () => {
    const result = component['_processChunk']('qna', `ma'am`);
    expect(result).toEqual('ma&apos;am');

    const resultRT = component['_processChunk']('related_topic', [
      {
        link: 'some random link',
        name: `project's efforts`,
      },
    ]);

    expect(resultRT).toEqual(
      '[{"link":"some random link","name":"project&apos;s efforts"}]',
    );
  });

  it('should append the answer to copy for qna case', () => {
    component.answerToCopy = `Leave `;
    component['_handleEventTypes']('qna', 'bad group', signals);
    expect(component.answerToCopy).toEqual(`Leave bad group`);
  });

  it('should not append the answer to copy when non-qna case', () => {
    component.answerToCopy = `Panchayat `;
    component['_handleEventTypes'](
      'video',
      '<video>4393_png.png</video>',
      signals,
    );
    expect(component.answerToCopy).toEqual(`Panchayat `);
  });

  it('should add naContent to answer to copy', () => {
    component.answerToCopy = '';
    component['_handleNAType']('<NA5></NA5>', signals);
    expect(component.answerToCopy).toEqual(NAStrings.nA5);
  });

  it('should reset variables on a new question', () => {
    component.manualScrollingHitsRockBottom = true;
    component.manualScrollingInProgress = true;
    component.lastKnownScrollTop = 67;
    component.answerToCopy = `Good job`;

    component['_resetVariablesOnNewQuestion']();

    expect(component.manualScrollingHitsRockBottom).toBeFalsy();
    expect(component.manualScrollingInProgress).toBeFalsy();
    expect(component.lastKnownScrollTop).toBe(Integers.Zero);
  });

  it('should add naContent to answer to copy for type feature', () => {
    component.answerToCopy = '';
    component['_handleFeatureType']('<NA4></NA4>', signals);
    expect(component.answerToCopy).toEqual(NAStrings.nA4);
  });

  it('should not append the answer to copy when feature type even if na4 comes in qna type', () => {
    component.answerToCopy = `Panchayat `;
    component['_handleEventTypes']('NA', '<NA4></NA4>', signals);
    expect(component.answerToCopy).toEqual(`Panchayat `);
    component['_handleEventTypes']('feature', '<NA3>hello</NA3>', signals);
    expect(component.answerToCopy).toEqual(
      `Panchayat ${NAStrings.nA3(
        'hello',
        environment.featureRequestORBugReportURL,
      )}`,
    );
  });

  it('should call _disableSubmitButton with false when type is "start"', () => {
    spyOn(component, 'disableSubmitButton');
    component['_handleEventTypes']('start', '', signals);

    expect(component.disableSubmitButton).toHaveBeenCalledWith(false);
  });
});
