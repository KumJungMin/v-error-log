import type { ViewModel } from "../types";

const ROOT_COMPONENT_NAME = "<Root>";
const ANONYMOUS_COMPONENT_NAME = "<Anonymous>";

export function generateComponentTrace(vm?: ViewModel): string {
  const hasParentInstance = vm && (vm._isVue || vm.__isVue) && vm.$parent;

  if (hasParentInstance) {
    const tree = stackTrace(vm);
    return formatTree(tree);
  }
  return `\n\n(found in ${formatComponentName(vm)})`;
}


function stackTrace(vm: ViewModel): ViewModel[] {
  const tree = [];
  let currentRecursiveSequence = 0;

  while (vm) {
    if (tree.length > 0) {
      const last: ViewModel = tree[tree.length - 1];

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
  return tree;
}

function formatTree(tree: ViewModel[]) {
  const stackTreeList = (i: number, vm: ViewModel) => {
    const prefix = i === 0 ? "---> " : " ".repeat(5 + i * 2);
    const stackedTree = Array.isArray(vm)
      ? `${formatComponentName(vm[0])}... (${vm[1]} recursive calls)`
      : formatComponentName(vm);

    return `${prefix} ${stackedTree}`;
  };

  const result = tree.map((vm, i) => stackTreeList(i, vm)).join("\n");

  return `\n\nfound in\n\n${result}`;
}

export function formatComponentName(
  vm?: ViewModel,
  includeFile = true,
): string {
  if (!vm || !vm.$options) return ANONYMOUS_COMPONENT_NAME;
  if (vm.$root === vm) return ROOT_COMPONENT_NAME;

  const options = vm.$options;
  const file = options.__file;
  let name = options.name || options._componentTag || options.__name;

  if (!name && file) {
    const match = file.match(/([^/\\]+)\.vue$/);
    if (match) name = match[1];
  }

  const componentName = name ? `<${name}>` : ANONYMOUS_COMPONENT_NAME;
  const filePath = file && includeFile ? ` at ${file}` : "";

  return filePath ? `${componentName} ${filePath}` : componentName;
}
