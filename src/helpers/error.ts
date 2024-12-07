import { ViewModel } from '../types';
import { formatComponentName, generateComponentTrace } from './component';

export function beautifyError(
  error: Error,
  vm?: ViewModel,
  lifecycleHook?: string | null
): string {
  const messageParts: string[] = [`Error: ${error.message}`];

  if (vm) {
    const componentName = formatComponentName(vm, false);
    messageParts.push(`Component: ${componentName}`);

    if (lifecycleHook) messageParts.push(`Lifecycle Hook: ${lifecycleHook}`);
    messageParts.push(generateComponentTrace(vm));
  }
  if (error.stack) parseErrorStack(error, messageParts);
  

  return messageParts.join('\n');
}

function parseErrorStack(error: Error, messageParts: string[]) {
  const stackLines = error.stack?.split('\n');
  if (!stackLines) return;
  
  const relevantLine = stackLines.find((line) => line.trim().startsWith('at '));

  if (relevantLine) {
    const match = relevantLine.match(/at\s+(\S+)?\s*\((.*):(\d+):(\d+)\)/) ||
      relevantLine.match(/at\s+(.*):(\d+):(\d+)/);
    
      if (match) {
      if (match.length === 5) {
        let [, funcName, fullPath, line, column] = match;
        const fileName = fullPath.split('/').pop()?.split('?')[0] ?? fullPath;
        funcName = simplifyFunctionName(funcName);

        messageParts.push(`\nError Location: ${funcName} in ${fileName} at line ${line}, column ${column}`);
      } else if (match.length === 4) {
        const [, fullPath, line, column] = match;
        const fileName = fullPath.split('/').pop()?.split('?')[0] ?? fullPath;

        messageParts.push(`\nError Location: ${fileName} at line ${line}, column ${column}`);
      }
    }
  }
}

function simplifyFunctionName(funcName: string): string {
  if (funcName.startsWith('_createElementVNode')) {
    const nextPart = funcName.split('.').find((part, index) => index > 0 && part !== '_cache' && part !== '<computed>');
    return nextPart ? `(${nextPart})` : 'unknown';
  }
  if (funcName.includes('.')) {
    const parts = funcName.split('.');
    return parts[parts.length - 1];
  }
  if (funcName.includes('<computed>')) {
    return 'computed property';
  }
  return funcName;
}