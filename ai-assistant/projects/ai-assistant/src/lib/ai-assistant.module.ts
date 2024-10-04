import {CUSTOM_ELEMENTS_SCHEMA, Injector, NgModule} from '@angular/core';
import {AiAssistantComponent} from './ai-assistant.component';
import {createCustomElement} from '@angular/elements';
import {
  CoPilotComponent,
  CoPilotHeaderComponent,
  CoPilotIntroPanelComponent,
  CoPilotMessageActionsComponent,
  CoPilotRelatedTopicsComponent,
} from './components';
import {CoPilotImageComponent} from './components/co-pilot-image/co-pilot-image.component';
import {CopilotVideoComponent} from './components/copilot-video/copilot-video.component';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatChipsModule} from '@angular/material/chips';
import {
  CoPilotImage,
  CoPilotMessageActions,
  CoPilotRelatedTopics,
  CoPilotVideo,
} from './constants';
import {CoPilotDownvoteComponent} from './components/co-pilot-downvote/co-pilot-downvote.component';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {LocalizationPipe} from './pipes/localization.pipe';
import {MatTooltipModule} from '@angular/material/tooltip';
import {DeepChatUtilService} from './services/deep-chat-util.service';
import {CoPilotVideoService, DeepChatCommsService} from './services';
import {SseService} from './services/sse.service';
import {ImageStoreService} from './services/image-store.service';
import {CoPilotImageViewerComponent} from './components/co-pilot-image-viewer/co-pilot-image-viewer.component';

@NgModule({
  declarations: [
    AiAssistantComponent,
    CoPilotComponent,
    CoPilotHeaderComponent,
    CoPilotIntroPanelComponent,
    CoPilotMessageActionsComponent,
    CoPilotRelatedTopicsComponent,
    CoPilotDownvoteComponent,
    CoPilotImageComponent,
    CopilotVideoComponent,
    LocalizationPipe,
    CoPilotImageViewerComponent,
  ],
  imports: [
    MatDividerModule,
    MatChipsModule,
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatTooltipModule,
  ],
  exports: [
    AiAssistantComponent,
    CoPilotComponent,
    CoPilotDownvoteComponent,
    CoPilotHeaderComponent,
    CoPilotImageComponent,
    CoPilotImageViewerComponent,
    CoPilotMessageActionsComponent,
    CoPilotRelatedTopicsComponent,
    CopilotVideoComponent,
  ],
  // NEEDED FOR DEEP-CHAT TO LOAD
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    LocalizationPipe,
    DeepChatUtilService,
    DeepChatCommsService,
    CoPilotVideoService,
    SseService,
    ImageStoreService,
  ],
})
export class AiAssistantModule {
  constructor(private injector: Injector) {}

  ngDoBootstrap() {
    const messageActionsCustomElement = createCustomElement(
      CoPilotMessageActionsComponent,
      {
        injector: this.injector,
      },
    );

    const messageRelatedTopicsCustomElement = createCustomElement(
      CoPilotRelatedTopicsComponent,
      {
        injector: this.injector,
      },
    );

    const streamedImageCustomElement = createCustomElement(
      CoPilotImageComponent,
      {
        injector: this.injector,
      },
    );

    const videoCustomElement = createCustomElement(CopilotVideoComponent, {
      injector: this.injector,
    });

    customElements.get(CoPilotMessageActions) ||
      customElements.define(CoPilotMessageActions, messageActionsCustomElement);
    customElements.get(CoPilotRelatedTopics) ||
      customElements.define(
        CoPilotRelatedTopics,
        messageRelatedTopicsCustomElement,
      );
    customElements.get(CoPilotImage) ||
      customElements.define(CoPilotImage, streamedImageCustomElement);
    customElements.get(CoPilotVideo) ||
      customElements.define(CoPilotVideo, videoCustomElement);
  }
}
