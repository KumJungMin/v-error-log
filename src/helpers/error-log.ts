import type { VueApp, ViewModel, InterceptorHandler } from '../types';
import { getComponentName } from './component';

export const attachErrorInterceptor = (app: VueApp, errorHandler: InterceptorHandler): void => {

  app.config.errorHandler = (error: Error, vm: ViewModel, lifecycleHook: string): void => {
    const componentName = getComponentName(vm);

    errorHandler(error, componentName, lifecycleHook);
  };
};