export enum NACase {
  NA6 = '6',
  NA5 = '5',
  NA4 = '4',
  NA3 = '3',
}

export const NAStrings = {
  nA6: `Hi! How can I help you today? Is there anything you'd like to know or anything I can do for you?`,
  nA5: `Could you please provide more context or details about what you would like me to consider?`,
  nA4: `It seems that I don't have enough information to respond to such queries. Is there anything else I can help you with?`,
  nA3: (featureName: string, url: string) =>
    `At the moment, the ${featureName} feature is not available in Project Manager. ` +
    'However, we truly value your feedback and continuously strive ' +
    `to improve our offerings based on user suggestions. ` +
    'Your input is incredibly valuable to us as we work ' +
    "towards enhancing our tool's capabilities." +
    ' Use the link below to share feedback with us.' +
    `<br>Report a Bug / Request for a feature/suggestion - <a href="${url}" target="_blank"> Link </a>`,
};
