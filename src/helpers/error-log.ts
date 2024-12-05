import type { VueApp, ViewModel, InterceptorHandler } from '../types';
import { transformErrorMessage } from './component';

export const attachErrorInterceptor = (app: VueApp, errorHandler: InterceptorHandler): void => {

  app.config.errorHandler = (error: Error, vm: ViewModel, lifecycleHook: string): void => {
    const errorMessage = transformErrorMessage(error, vm, lifecycleHook);
    errorHandler(errorMessage);
  };
};