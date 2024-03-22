export function validate(value: any, rulesLiteral: string) {
  const rules = rulesLiteral.split('|')
  let errors: string[] = []
  rules.map((rule: string) => {
    switch (rule) {
      case 'required':
        errors = [...errors, ...(!value || value.length === 0 ? ['cannot be empty'] : [])]
        break
      case 'email':
        errors = [
          ...errors,
          ...(!value || !value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) ? ['is invalid'] : []),
        ]
        break
      default:
        break
    }
  })
  return errors
}
