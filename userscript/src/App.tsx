import { EditSuggestionPanelEnhancer } from '@/global';
import { useInjectTranslations } from '@/hooks';
import { LanguageTranslations } from '@/@waze/I18n';
import { getWazeMapEditorWindow } from '@/utils';
import { ReactElement } from 'react';
import staticUserscriptTranslations from './localization/static/userscript.json';

interface AppProps {
  translations: LanguageTranslations | null;
}
export function App(props: AppProps): ReactElement {
  const currentLocale = getWazeMapEditorWindow().I18n.currentLocale();
  useInjectTranslations(props.translations ?? { [currentLocale]: staticUserscriptTranslations });

  return <EditSuggestionPanelEnhancer />
}
