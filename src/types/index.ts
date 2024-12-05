import type { Vue, VueConstructor } from 'vue'; 
import type { App, ComponentPublicInstance } from 'vue'; 

export type ViewModel = Vue | ComponentPublicInstance | null;

export type VueApp = VueConstructor | App;

export type InterceptorHandler = (errorMessage: string) => void;