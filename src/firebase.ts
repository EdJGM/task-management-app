import { initializeApp } from 'firebase/app';
import { clientConfig } from './firebase/config';

export const app = initializeApp(clientConfig);