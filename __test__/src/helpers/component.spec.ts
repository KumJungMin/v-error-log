import { describe, it, expect } from 'vitest';
import {
  formatComponentName,
  generateComponentTrace,
} from '@/helpers/component';
import { ViewModel } from '@/types';

class ComponentA {}
class ComponentB {}

const createMockViewModel = (
  overrides?: Partial<ViewModel>,
  constructorFn = ComponentA,
): ViewModel => {
  const vm: ViewModel = {
    $parent: null,
    $root: null,
    $options: {},
    ...overrides,
  };
  Object.setPrototypeOf(vm, constructorFn.prototype);
  return vm;
};

describe('formatComponentName 함수', () => {
  it('만약 vm이 undefined이면 <Anonymous>를 반환해야 합니다', () => {
    expect(formatComponentName(undefined)).toBe('<Anonymous>');
  });

  it('만약 vm이 root이면 <Root>를 반환해야 합니다', () => {
    const vm = createMockViewModel();
    vm.$root = vm;

    expect(formatComponentName(vm)).toBe('<Root>');
  });

  it('만약 vm이 name을 가지고 있으면 해당 이름을 반환해야 합니다', () => {
    const vm = createMockViewModel({
      $options: { name: 'MyComponent' },
    });

    expect(formatComponentName(vm)).toBe('<MyComponent>');
  });

  it('만약 vm이 $options.__name을 가지고 있으면 해당 이름을 반환해야 합니다', () => {
    const vm = createMockViewModel({
      $options: { __name: 'AnotherComponent' },
    });

    expect(formatComponentName(vm)).toBe('<AnotherComponent>');
  });

  it('만약 vm이 $options._componentTag을 가지고 있으면 해당 이름을 반환해야 합니다', () => {
    const vm = createMockViewModel({
      $options: { _componentTag: 'TagComponent' },
    });

    expect(formatComponentName(vm)).toBe('<TagComponent>');
  });

  it('만약 vm이 name, __name, _componentTag을 가지고 있으면 name을 우선하여 반환해야 합니다', () => {
    const vm = createMockViewModel({
      $options: { __file: '/path/to/MyComponent.vue' },
    });

    expect(formatComponentName(vm)).toBe(
      '<MyComponent>  at /path/to/MyComponent.vue',
    );
  });

  it('만약 vm이 name, __name, _componentTag을 가지고 있지 않으면 <Anonymous>를 반환해야 합니다', () => {
    const vm = createMockViewModel({ $options: {} });
    expect(formatComponentName(vm)).toBe('<Anonymous>');
  });

  it('만약 vm이 file을 가지고 있으면 파일 경로를 포함하여 반환해야 합니다', () => {
    const vm = createMockViewModel({
      $options: {
        name: 'MyComponent',
        __file: '/path/to/MyComponent.vue',
      },
    });

    expect(formatComponentName(vm)).toBe(
      '<MyComponent>  at /path/to/MyComponent.vue',
    );
  });

  it('includeFile이 false인 경우 파일 경로를 포함하지 않아야 합니다', () => {
    const vm = createMockViewModel({
      $options: {
        name: 'MyComponent',
        __file: '/path/to/MyComponent.vue',
      },
    });

    expect(formatComponentName(vm, false)).toBe('<MyComponent>');
  });

  it('파일만 가지고 있는 경우 파일명을 컴포넌트 이름으로 사용해야 합니다', () => {
    const vm = createMockViewModel({
      $options: {
        __file: '/path/to/component.js',
      },
    });

    expect(formatComponentName(vm)).toBe(
      '<Anonymous>  at /path/to/component.js',
    );
  });
});

describe('generateComponentTrace 함수', () => {
  it('만약 vm이 undefined이면 <Anonymous>를 반환해야 합니다', () => {
    expect(generateComponentTrace(undefined)).toBe(
      '\n\n(found in <Anonymous>)',
    );
  });

  it('만약 vm이 root이면 <Root>를 반환해야 합니다', () => {
    const vm = createMockViewModel({
      $options: {
        name: 'RootComponent',
      },
    });
    vm.$root = vm;

    expect(generateComponentTrace(vm)).toBe('\n\n(found in <Root>)');
  });

  it('만약 vm이 parent를 가지고 있으면 부모 컴포넌트 이름을 포함해야 합니다', () => {
    const parentVm = createMockViewModel(
      { $options: { name: 'ParentComponent' } },
      ComponentA,
    );
    const vm = createMockViewModel(
      {
        $parent: parentVm,
        $options: { name: 'ChildComponent' },
      },
      ComponentB,
    );

    const expectedTrace = `

found in

--->  <ChildComponent>
        <ParentComponent>`;

    expect(generateComponentTrace(vm)).toBe(expectedTrace);
  });
});
