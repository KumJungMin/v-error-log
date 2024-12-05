import type { ViewModel } from '../types';

export function getComponentName(vm: ViewModel): string {
  return vm.$options && vm.$options.__name ? vm.$options.__name : 'Anonymous';
}