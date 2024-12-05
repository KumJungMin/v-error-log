import type { ViewModel } from '../types';

const ROOT_COMPONENT_NAME = '<Root>';
const ANONYMOUS_COMPONENT_NAME = '<Anonymous>';

export function transformErrorMessage(
  error: Error,
  vm?: ViewModel,
  lifecycleHook?: string
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

function repeat(str: string, n: number) {
  return str.repeat(n);
}

function generateComponentTrace(vm?: ViewModel): string {
  const hasParentInstance = vm && (vm._isVue || vm.__isVue) && vm.$parent

  if (hasParentInstance) {
    const tree = [];
    let currentRecursiveSequence = 0;
    while (vm) {
      if (tree.length > 0) {
        const last = tree[tree.length - 1] as any;
        if (last.constructor === vm.constructor) {
          currentRecursiveSequence++;
          vm = vm.$parent;
          continue;
        } else if (currentRecursiveSequence > 0) {
          tree[tree.length - 1] = [last, currentRecursiveSequence];
          currentRecursiveSequence = 0;
        }
      }
      tree.push(vm);
      vm = vm.$parent;
    }
    return getFormattedTree(tree);
  }
  return `\n\n(found in ${formatComponentName(vm)})`;
};

function getFormattedTree(tree: any[]) {
  const formattedTree = tree
    .map(
      (vm, i) => `${(i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) +
        (Array.isArray(vm)
          ? `${formatComponentName(vm[0])}... (${vm[1]} recursive calls)`
          : formatComponentName(vm))}`
    )
    .join('\n');

  return `\n\nfound in\n\n${formattedTree}`;
}


function formatComponentName(vm?: ViewModel, includeFile = true): string {
  if (!vm) return ANONYMOUS_COMPONENT_NAME;
  if (vm.$root === vm) return ROOT_COMPONENT_NAME;
  if (!vm.$options) return ANONYMOUS_COMPONENT_NAME;

  const options = vm.$options;

  let name = options.name || options._componentTag || options.__name;
  const file = options.__file;

  if (!name && file) {
    const match = file.match(/([^/\\]+)\.vue$/);
    if (match) name = match[1];
  }

  const componentName = name ? `<${name}>` : ANONYMOUS_COMPONENT_NAME
  const filePath = file && includeFile ? ` at ${file}` : '';

  return (`${componentName} ${filePath}`);
};

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
