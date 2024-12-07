import { getCurrentInstance } from 'vue';
import { beautifyError } from '../helpers/error';

export function useErrorLogger() {
  const instance = getCurrentInstance();

  function sendErrorLog(error: Error) {
    const instanceProxy = instance?.proxy;
    const formattedError = beautifyError(error, instanceProxy)
    
    console.error(formattedError);
  }

  return { sendErrorLog };
}
