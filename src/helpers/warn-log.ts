import type { VueApp, ViewModel, InterceptorHandler } from '../types';
import { getComponentName } from './component';

export const attachWarnInterceptor = (app: VueApp, warnHandler: InterceptorHandler): void => {

  app.config.warnHandler = (error: Error, vm: ViewModel, lifecycleHook: string): void => {
    const componentName = getComponentName(vm);

    warnHandler(error, componentName, lifecycleHook);

  }
};