import { WmeSdkContext } from '@/contexts/WmeSdkContext';
import { EditSuggestionPanelEnhancer } from '@/global';
import { HandledEditSuggestionsProvider } from '@/global/contexts';
import { useInjectTranslations } from '@/hooks';
import { LanguageTranslations } from '@/@waze/I18n';
import { getWazeMapEditorWindow } from '@/utils';
import { ReactElement, useMemo } from 'react';
import staticUserscriptTranslations from './localization/static/userscript.json';
import { WmeSDK } from 'wme-sdk-typings';

interface AppProps {
  translations: LanguageTranslations | null;
}
export function App(props: AppProps): ReactElement {
  const currentLocale = getWazeMapEditorWindow().I18n.currentLocale();
  useInjectTranslations(
    props.translations ?? { [currentLocale]: staticUserscriptTranslations },
  );
  const wmeSdk: WmeSDK = useMemo(() => {
    const window = getWazeMapEditorWindow();
    if (!('getWmeSdk' in window)) return null;
    return window.getWmeSdk({
      scriptId: process.env.SCRIPT_ID,
      scriptName: process.env.SCRIPT_NAME,
    });
  }, []);

  return (
    <WmeSdkContext.Provider value={wmeSdk}>
      <HandledEditSuggestionsProvider>
        <EditSuggestionPanelEnhancer />
      </HandledEditSuggestionsProvider>
    </WmeSdkContext.Provider>
  );
}
