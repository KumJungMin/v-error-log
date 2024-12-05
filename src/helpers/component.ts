import type { ViewModel } from '../types';
import Utils from '../utils';

const ROOT_COMPONENT_NAME = '<Root>';
const ANONYMOUS_COMPONENT_NAME = '<Anonymous>';

export function generateComponentTrace(vm?: ViewModel): string {
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
      (vm, i) => `${(i === 0 ? '---> ' : Utils.repeat(' ', 5 + i * 2)) +
        (Array.isArray(vm)
          ? `${formatComponentName(vm[0])}... (${vm[1]} recursive calls)`
          : formatComponentName(vm))}`
    )
    .join('\n');

  return `\n\nfound in\n\n${formattedTree}`;
}

export function formatComponentName(vm?: ViewModel, includeFile = true): string {
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



