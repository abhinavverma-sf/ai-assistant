import {Injectable} from '@angular/core';
import {MessageStyles} from 'deep-chat/dist/types/messages';
import {Request} from 'deep-chat/dist/types/request';
import {CustomStyle, StatefulStyles} from 'deep-chat/dist/types/styles';
import {SubmitButtonStyles} from 'deep-chat/dist/types/submitButton';
import {TextInput} from 'deep-chat/dist/types/textInput';

import {
  aiBorderRadius,
  aiBorderRadiusTopRight,
  aiBubbleBackgroundColor,
  aiBubblePadding,
  aiFontSize,
  aiOuterContainerMaxWidth,
  bubbleBackgroundColor,
  bubbleColor,
  bubbleFontSize,
  bubbleFontWeight,
  bubbleLineHeight,
  bubblePadding,
  CHAT_STYLES,
  FEEDBACK_STYLES,
  fullWidth,
  SUBMIT_BUTTON_STYLES,
  TEXT_INPUT_STYLES,
} from '../constants';
import {CoPilotRoles} from '../enums';

@Injectable()
export class DeepChatUtilService {
  constructor() {}

  getMessageStyles(): MessageStyles {
    return {
      default: {
        user: {
          bubble: {
            backgroundColor: bubbleBackgroundColor,
            color: bubbleColor,
            fontSize: bubbleFontSize,
            lineHeight: bubbleLineHeight,
            fontWeight: bubbleFontWeight,
            padding: bubblePadding,
            borderTopRightRadius: aiBorderRadiusTopRight,
          },
        },
        ai: {
          bubble: {
            backgroundColor: aiBubbleBackgroundColor,
            padding: aiBubblePadding,
            fontSize: aiFontSize,
            maxWidth: aiOuterContainerMaxWidth,
            borderRadius: aiBorderRadius,
          },
          outerContainer: {
            maxWidth: fullWidth,
            borderRadius: aiBorderRadius,
          },
        },
        [CoPilotRoles.FEEDBACK]: {
          outerContainer: {
            maxWidth: FEEDBACK_STYLES.fullWidth,
          },
          innerContainer: {
            maxWidth: FEEDBACK_STYLES.fullWidth,
          },
          bubble: {
            backgroundColor: FEEDBACK_STYLES.backgroundColor,
            borderTop: FEEDBACK_STYLES.borderTop,
            padding: FEEDBACK_STYLES.paddingTop,
            width: FEEDBACK_STYLES.width,
            maxWidth: FEEDBACK_STYLES.maxWidth,
            marginTop: FEEDBACK_STYLES.marginTop,
            borderBottomLeftRadius: FEEDBACK_STYLES.borderRadius,
            borderBottomRightRadius: FEEDBACK_STYLES.borderRadius,
            borderTopLeftRadius: FEEDBACK_STYLES.topBorderRadius,
            borderTopRightRadius: FEEDBACK_STYLES.topBorderRadius,
            height: FEEDBACK_STYLES.height,
          },
        },
      },
    };
  }

  getChatStyles(): CustomStyle {
    return {
      width: CHAT_STYLES.width,
      height: CHAT_STYLES.height,
      backgroundColor: CHAT_STYLES.backgroundColor,
    };
  }

  getTextInput(placeholderLabel: string): TextInput {
    return {
      placeholder: {
        text: placeholderLabel,
        style: {
          color: TEXT_INPUT_STYLES.placeholderColor,
          fontSize: TEXT_INPUT_STYLES.placeholderFontSize,
        },
      },
      styles: {
        container: {
          margin: TEXT_INPUT_STYLES.containerMargin,
          width: TEXT_INPUT_STYLES.containerWidth,
          minHeight: TEXT_INPUT_STYLES.containerMinHeight,
          maxHeight: TEXT_INPUT_STYLES.containerMaxHeight,
        },
        text: {
          paddingTop: TEXT_INPUT_STYLES.textPadding,
          paddingBottom: TEXT_INPUT_STYLES.textPadding,
          paddingLeft: TEXT_INPUT_STYLES.textPadding,
          color: TEXT_INPUT_STYLES.textColor,
          fontSize: TEXT_INPUT_STYLES.textFontSize,
        },
      },
    };
  }

  getRequestConnection(): Request {
    return {};
  }

  getSubmitButtonStyles(): SubmitButtonStyles {
    return {
      submit: {
        container: this._getSubmitButtonContainer(),
        svg: this._getSubmitButtonActiveSvg(),
      },
      stop: {
        container: this._getSubmitButtonContainer(),
        svg: this._getStopButtonDisabledSvg(),
      },
      loading: {
        container: this._getSubmitButtonContainer(),
        svg: this._getSubmitButtonDisabledSvg(),
      },
      disabled: {
        container: this._getSubmitButtonContainer(),
        svg: this._getSubmitButtonDisabledSvg(),
      },
    };
  }

  private _getSubmitButtonContainer(): StatefulStyles {
    return {
      default: {
        top: SUBMIT_BUTTON_STYLES.containerTop,
        right: SUBMIT_BUTTON_STYLES.containerRight,
      },
    };
  }

  private _getSubmitButtonActiveSvg() {
    return {
      content: SUBMIT_BUTTON_STYLES.svgContent,
    };
  }

  private _getStopButtonDisabledSvg(): {
    content: string;
  } {
    return {
      content: SUBMIT_BUTTON_STYLES.circleContent,
    };
  }

  private _getSubmitButtonDisabledSvg(): {
    content: string;
    styles: StatefulStyles;
  } {
    return {
      content: SUBMIT_BUTTON_STYLES.svgContent,
      styles: {
        default: {
          filter: SUBMIT_BUTTON_STYLES.disabledSvgFilter,
          cursor: SUBMIT_BUTTON_STYLES.disabledCursorState,
        },
      },
    };
  }
}
