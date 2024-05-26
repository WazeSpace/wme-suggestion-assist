import { createReactPortal } from '@/utils';

export const UtilityButtonsRowPortal = createReactPortal(() => {
  return document.querySelector('.panel-header-actions');
});
