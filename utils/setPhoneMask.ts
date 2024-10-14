export default (countryPhoneCode: number): string => {
  switch (countryPhoneCode) {
    case 1:
    case 62:
    case 91:
      return '###-###-####'
    case 374:
      return '##-###-##-##'
    case 375:
    case 998:
      return '(##) ###-##-##'
    case 992:
    case 994:
    case 995:
    case 996:
      return '###-###-##-##'
    default:
      return '(###) ###-##-##'
  }
}
