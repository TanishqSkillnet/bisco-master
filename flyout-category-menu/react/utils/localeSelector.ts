export function localeSelector(userLocale: string) {
  const locale = userLocale.split('-')[0]

  switch (locale) {
    case 'en':
      return 'en'
    case 'pt':
      return 'pt'
    case 'ja':
      return 'ja'
    case 'zh':
      return 'zh'
    case 'es':
      return 'es'
    case 'ko':
      return 'ko'
    case 'it':
      return 'it'
    case 'pl':
      return 'pl'
    case 'fr':
      return 'fr'
    case 'ru':
      return 'ru'
    case 'de':
      return 'de'
    default:
      return 'en'
  }
}
