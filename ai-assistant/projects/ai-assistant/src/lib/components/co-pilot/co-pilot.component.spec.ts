import {HttpClientModule} from '@angular/common/http';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import {Signals} from 'deep-chat/dist/types/handler';
import {MessageContent} from 'deep-chat/dist/types/messages';
import {of} from 'rxjs';

import {NAStrings} from '../../enums';
import {DeepChatCommsService, DeepChatUtilService} from '../../services';
import {ImageStoreService} from '../../services/image-store.service';
import {SseService} from '../../services/sse.service';
import {CoPilotComponent} from './co-pilot.component';
import {AnyObject} from '../../interfaces';
import {Integers} from '../../enums/numbers.enum';

describe('CoPilotComponent', () => {
  let component: CoPilotComponent;
  let fixture: ComponentFixture<CoPilotComponent>;
  let deepChatUtilSvcSpy: jasmine.SpyObj<DeepChatUtilService>;
  let deepChatCommsSvcSpy: jasmine.SpyObj<DeepChatCommsService>;
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
    deepChatUtilSvcSpy = jasmine.createSpyObj('DeepChatUtilService', [
      'getChatStyles',
      'getMessageStyles',
      'getInputStyles',
      'getTextInput',
      'getRequestConnection',
      'getSubmitButtonStyles',
    ]);

    deepChatCommsSvcSpy = jasmine.createSpyObj('DeepChatCommsService', [
      'receiveTrigger',
      'onVideoScrollPosition',
    ]);

    sseServiceSpy = jasmine.createSpyObj('SseService', ['connectToSse']);

    imageStoreSvcSpy = jasmine.createSpyObj('ImageStoreService', ['removeMap']);

    await TestBed.configureTestingModule({
      declarations: [CoPilotComponent],
      imports: [MatDialogModule, HttpClientModule],
      providers: [
        {provide: MatDialogRef, useValue: {}},
        {provide: MAT_DIALOG_DATA, useValue: []},
        {provide: DeepChatUtilService, useValue: deepChatUtilSvcSpy},

        {
          provide: DeepChatCommsService,
          useValue: deepChatCommsSvcSpy,
        },
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

    component['_initializeState'](reqBody);

    sseServiceSpy.connectToSse.and.returnValue(of());

    component['_subscribeToSse'](reqBody, signals);
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
      `Panchayat ${NAStrings.nA3('hello', '')}`,
    );
  });

  it('should call _disableSubmitButton with false when type is "start"', () => {
    spyOn(component, 'disableSubmitButton');
    component['_handleEventTypes']('start', '', signals);

    expect(component.disableSubmitButton).toHaveBeenCalledWith(false);
  });
});
