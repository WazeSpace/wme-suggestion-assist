import { createContext } from 'react';
import { WmeSDK } from 'wme-sdk-typings';

export const WmeSdkContext = createContext<WmeSDK>(null);
