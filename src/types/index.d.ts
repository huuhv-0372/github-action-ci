// gkc_hash_code : 01GV08E07716MKFVFKX31BQC9G
declare global {
  interface Window {
    webkit: {
      messageHandlers: {
        callbackHandler: {
          postMessage: (message: any) => void;
        };
        firebase: {
          postMessage: (message: any) => void;
        };
      };
    };
    AndroidWebView: {
      postMessage: (message: any) => void;
    };
    AnalyticsWebInterface: {
      logEvent: (message: any, params: any) => void;
    };
  }
}

interface ISelect {
  value: string;
  label: string;
}

type CustomerInfo = {
  jmbCustomerId: string;
  firstNameKanji: string;
  lastNameKanji: string;
  firstNameKana: string;
  lastNameKana: string;
  firstNameRomaji: string;
  lastNameRomaji: string;
  middleName: string;
  gender: string;
  dateOfBirth: string;
  country: string;
  mailAddress: string;
  addressZipCode: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  phoneNumber: string;
  telephone: string;
  profession: ISelect;
  transaction: ISelect;
  travelSchedule: string;
  travelDate: string;
  destination: ISelect;
  card: string;
  cardConfirm: string;
};

type KeyCustomerInfo =
  | 'firstNameKanji'
  | 'lastNameKanji'
  | 'firstNameKana'
  | 'lastNameKana'
  | 'firstNameRomaji'
  | 'lastNameRomaji'
  | 'profession'
  | 'transaction'
  | 'destination'
  | 'travelDate';

export { CustomerInfo, ISelect, KeyCustomerInfo };
