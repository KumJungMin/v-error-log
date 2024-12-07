import { getCurrentInstance } from 'vue';
import { beautifyError } from '../helpers/error';

export function useErrorLogger() {
  const instance = getCurrentInstance();

  function sendErrorLog(error: Error) {
    const formattedError = instance ? beautifyError(error, instance.proxy, null) : '';
    
    console.error(formattedError);
  }

  return { sendErrorLog };
}
