export const businessDayCalculation = (numberOfDays: number | undefined) => {
  if (!numberOfDays || numberOfDays === NaN) {
    return null
  }

  const numberOfDaysToAdd = Math.abs(numberOfDays)
  const daysToAdd = numberOfDays < 0 ? -1 : 1
  let businessDaysAdded = 0

  let date = new Date()

  while (businessDaysAdded < numberOfDaysToAdd) {
    date.setDate(date.getDate() + daysToAdd)

    if (date.getDay() == 6 || date.getDay() == 0) {
      continue
    }
    businessDaysAdded++
  }

  return date
}
