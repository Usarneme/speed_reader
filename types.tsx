/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
};

export type BottomTabParamList = {
  TabOne: undefined;
  Reader: undefined;
};

export type TabOneParamList = {
  TabOneScreen: undefined;
};

export type ReaderParamList = {
  ReaderScreen: undefined;
};

// https://github.com/goatandsheep/react-native-dotenv/issues/52
declare module '@env' {
  export const FIREBASE_API_KEY: string;
  export const FIREBASE_AUTH_DOMAIN: string;
  export const FIREBASE_PROJECT_ID: string;
  export const FIREBASE_STORAGE_BUCKET: string;
  export const FIREBASE_MESSAGING_SENDER: string;
  export const FIREBASE_APP_ID: string;
  export const FIREBASE_MEASUREMENT_ID: string;
  export const KEY: string;
  export const KAY: string;
  export const KOY: string;
};
