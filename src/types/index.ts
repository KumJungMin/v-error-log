import type { App, ComponentPublicInstance } from 'vue';

export type ViewModel = ComponentPublicInstance | null;

export type VueApp = App;

export type InterceptorHandler = (errorMessage: string) => void;

export type TreeItem = [ViewModel, number] | ViewModel;
