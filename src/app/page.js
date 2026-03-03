import { I18nProvider } from '@/lib/i18n';
import ClockzillaApp from '@/components/ClockzillaApp';
import ConsentManager from '@/components/ConsentManager';

export default function Home() {
  return (
    <I18nProvider>
      <ClockzillaApp />
      <ConsentManager />
    </I18nProvider>
  );
}
