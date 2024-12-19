import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { beautifyError } from '@/helpers/error';
import {
  formatComponentName,
  generateComponentTrace,
} from '@/helpers/component';
import { ViewModel } from '@/types';

vi.mock('@/helpers/component', () => ({
  formatComponentName: vi.fn(),
  generateComponentTrace: vi.fn(),
}));

describe('beautifyError', () => {
  const mockedFormatComponentName = formatComponentName as unknown as Mock;
  const mockedGenerateComponentTrace =
    generateComponentTrace as unknown as Mock;

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('에러만 제공된 경우 에러 메시지와 스택만 포함해야 합니다', () => {
    const error = new Error('Test error');
    error.stack = 'Error stack trace';

    const result = beautifyError(error);

    expect(result).toBe(`Error: Test error\n\n\nError stack trace`);
  });

  it('ViewModel이 제공된 경우 컴포넌트 이름과 컴포넌트 트레이스가 포함되어야 합니다', () => {
    const componentName = 'TestComponent';
    const error = new Error('Test error');
    const vm: ViewModel = {
      name: componentName,
    };

    mockedFormatComponentName.mockReturnValue(componentName);
    mockedGenerateComponentTrace.mockReturnValue('Component Trace');

    const result = beautifyError(error, vm);

    expect(result).toContain('Error: Test error');
    expect(result).toContain(`Component: ${componentName}`);
    expect(result).toContain('Component Trace');
  });

  it('스택 트레이스가 없는 에러를 처리해야 합니다', () => {
    const error = new Error('Test error');
    Object.defineProperty(error, 'stack', { value: undefined, writable: true });

    const result = beautifyError(error);

    expect(result).toBe(`Error: Test error`);
  });

  it('lifecycleHook이 제공된 경우 해당 생명주기 훅이 메시지에 포함되어야 합니다', () => {
    const error = new Error('Test error');
    const vm: ViewModel = {
      name: 'TestComponent',
    };
    const lifecycleHook = 'mounted';

    mockedFormatComponentName.mockReturnValue('TestComponent');
    mockedGenerateComponentTrace.mockReturnValue('Component Trace');

    const result = beautifyError(error, vm, lifecycleHook);

    expect(result).toContain('Error: Test error');
    expect(result).toContain('Component: TestComponent');
    expect(result).toContain(`Lifecycle Hook: ${lifecycleHook}`);
    expect(result).toContain('Component Trace');
  });

  it('lifecycleHook이 null인 경우 해당 부분이 생략되어야 합니다', () => {
    const error = new Error('Test error');
    const vm: ViewModel = {
      name: 'TestComponent',
    };

    mockedFormatComponentName.mockReturnValue('TestComponent');
    mockedGenerateComponentTrace.mockReturnValue('Component Trace');

    const result = beautifyError(error, vm, null);

    expect(result).toContain('Error: Test error');
    expect(result).toContain('Component: TestComponent');
    expect(result).toContain('Component Trace');
    expect(result).not.toContain('Lifecycle Hook:');
  });

  it('ViewModel 없이 lifecycleHook이 제공된 경우 lifecycleHook이 무시되어야 합니다', () => {
    const error = new Error('Test error');
    const lifecycleHook = 'mounted';

    const result = beautifyError(error, undefined, lifecycleHook);

    expect(result).toContain('Error: Test error');
    expect(result).not.toContain('Lifecycle Hook:');
  });
});
