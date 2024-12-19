import type { VueApp, ViewModel, InterceptorHandler } from '../types';
import { ComponentPublicInstance } from 'vue';
import { beautifyError } from './error';

export const attachErrorInterceptor = (
  app: VueApp,
  errorHandler: InterceptorHandler,
): void => {
  app.config.errorHandler = (
    err: unknown,
    instance: ComponentPublicInstance | null,
    info: string,
  ): void => {
    const errorMessage = beautifyError(
      err as Error,
      instance as ViewModel,
      info,
    );
    errorHandler(errorMessage);
  };
};
