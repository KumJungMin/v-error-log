import { ViewModel } from "../types";
import { formatComponentName, generateComponentTrace } from "./component";

export function beautifyError(
  error: Error,
  vm?: ViewModel,
  lifecycleHook?: string | null,
): string {
  const messageParts: string[] = [`Error: ${error.message}`];

  if (vm) {
    const componentName = formatComponentName(vm, false);
    messageParts.push(`Component: ${componentName}`);

    if (lifecycleHook) messageParts.push(`Lifecycle Hook: ${lifecycleHook}`);
    messageParts.push(generateComponentTrace(vm));
  }
  if (error.stack) messageParts.push(`\n\n${error.stack}`);

  return messageParts.join("\n");
}
