import { createReactPortal } from '@/utils';

export const HeaderPortal = createReactPortal(() =>
  document.querySelector('.edit-suggestion-panel :has(> .header-container)'),
);
