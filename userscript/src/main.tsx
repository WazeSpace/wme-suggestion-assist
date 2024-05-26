import { App } from '@/App';
import { getWazeMapEditorWindow } from '@/utils';
import axios from 'axios';
import { axiosGmXhrAdapter } from './tampermonkey/axios-gmxhr-adapter';
import CrowdinOtaClient from './localization/crowdin-ota/ota-client';

async function getRemoteTranslations() {
  if (!process.env.CROWDIN_DISTRIBUTION_HASH) return null;

  const currentLocale = getWazeMapEditorWindow().I18n.currentLocale();
  const translations = await new CrowdinOtaClient(
    process.env.CROWDIN_DISTRIBUTION_HASH,
  ).getStringsByLocale(currentLocale);
  return {
    [currentLocale]: translations,
  };
}
export default async function bootstrap() {
  axios.defaults.adapter = axiosGmXhrAdapter;

  const translations = await getRemoteTranslations();

  // eslint-disable-next-line react/no-deprecated
  ReactDOM.render(
    <App translations={translations} />,
    document.createElement('div'),
  );
}
