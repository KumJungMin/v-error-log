import type { VueApp, ViewModel, InterceptorHandler } from '../types';
import { beautifyError } from './error';

export const attachErrorInterceptor = (app: VueApp, errorHandler: InterceptorHandler): void => {

  app.config.errorHandler = (error: Error, vm: ViewModel, lifecycleHook: string): void => {
    const errorMessage = beautifyError(error, vm, lifecycleHook);
    errorHandler(errorMessage);
  };
};