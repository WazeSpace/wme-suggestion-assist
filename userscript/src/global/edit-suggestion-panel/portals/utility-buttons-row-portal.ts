import { createReactPortal } from '@/utils';

export const UtilityButtonsRowPortal = createReactPortal(() => {
  return document.querySelector('.suggestion-panel-header-actions');
});
