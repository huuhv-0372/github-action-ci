import { DataError } from './types';

export function logMessageEvent(
  eventType: string,
  dataError?: DataError | null,
  path?: string,
) {
  const postMessage = {
    eventType,
    payload: {
      errorResponse: dataError,
      path: path,
    },
  };
  !dataError && delete postMessage.payload.errorResponse;

  if (
    typeof window !== 'undefined' &&
    window.webkit &&
    window.webkit.messageHandlers &&
    window.webkit.messageHandlers.callbackHandler
  ) {
    window.webkit.messageHandlers.callbackHandler.postMessage(
      JSON.stringify(postMessage),
    );
  }
  if (typeof window !== 'undefined' && window.AndroidWebView) {
    window.AndroidWebView.postMessage(JSON.stringify(postMessage));
  }
}

export function logEventGA(name: string, params?: any) {
  if (window.AnalyticsWebInterface) {
    // Call Android interface
    window.AnalyticsWebInterface.logEvent(name, JSON.stringify(params ?? {}));
  } else if (
    window.webkit &&
    window.webkit.messageHandlers &&
    window.webkit.messageHandlers.firebase
  ) {
    // Call iOS interface
    var message = {
      command: 'logEvent',
      name: name,
      parameters: params ?? {},
    };
    window.webkit.messageHandlers.firebase.postMessage(message);
  } else {
    // No Android or iOS interface found
    console.log('No native APIs found.');
  }
}
