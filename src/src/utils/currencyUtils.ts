import countries from 'i18n-iso-countries';
import currencies from 'currency-codes';

countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

export function getCurrencyByCountry(countryName: string): string | null {
  const countryCode = countries.getAlpha2Code(countryName, 'en');
  if (!countryCode) return null;

  const currencyData = currencies.country(countryCode);
  return currencyData && currencyData.length > 0 ? currencyData[0].code : null;
}
