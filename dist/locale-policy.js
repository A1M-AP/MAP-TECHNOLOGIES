export function chooseLanguage({saved, country, browserLanguage = 'en'}) {
  if(saved === 'it' || saved === 'en') return saved;
  if(['IT','SM','VA'].includes(country)) return 'it';
  if(typeof country === 'string' && /^[A-Z]{2}$/.test(country) && country !== 'XX') return 'en';
  return /^it(?:-|$)/i.test(browserLanguage) ? 'it' : 'en';
}
