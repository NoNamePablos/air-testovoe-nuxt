import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { ref, computed } from 'vue'
import isValidDateString from '@/utils/isValidDateString'

export default function useFormValidation() {
  const schema = yup.object({
    title: yup.string().required('Наименование организации обязательно'),
    address: yup.string().required('Наименование организации обязательно'),
    phone: yup
      .string()
      .matches(/^\+\d{1,3} \(\d{3}\) \d{3}-\d{2}-\d{2}$/, 'Номер телефона некорректен')
      .required('Телефон обязателен'),
    field: yup.object().required('Тип помещения обязателен'),
    rangeField: yup.object({
      min: yup
        .number()
        .required('Минимальная площадь обязательна')
        .min(0, 'Минимальная площадь не может быть отрицательной')
        .max(yup.ref('max'), 'Минимальная площадь не может превышать максимальную площадь')
        .typeError('Площадь должна быть валидной'),
      max: yup
        .number()
        .required('Максимальная площадь обязательна')
        .min(yup.ref('min'), 'Максимальная площадь должна быть больше или равна минимальной')
        .positive('Максимальная площадь должна быть положительной')
        .typeError('Площадь должна быть валидной')
    }),
    rangeDate: yup.object({
      min: yup
        .string()
        .required('Дата начала аренды обязательна')
        .test('is-valid-date', 'Дата начала аренды должна быть валидной', isValidDateString)
        .typeError('Дата начала аренды должна быть валидной'),
      max: yup
        .string()
        .required('Дата окончания аренды обязательна')
        .test('is-valid-date', 'Дата окончания аренды должна быть валидной', isValidDateString)
        .test('is-later', 'Дата окончания должна быть позже даты начала', function (maxDateString) {
          const { min } = this.parent
          if (isValidDateString(min) && isValidDateString(maxDateString)) {
            const minDate = new Date(min.split('.').reverse().join('-'))
            const maxDate = new Date(maxDateString.split('.').reverse().join('-'))
            return maxDate > minDate
          }
          return true
        })
        .typeError('Дата окончания аренды должна быть валидной')
    })
  })

  const { handleSubmit, errors } = useForm({
    validationSchema: schema
  })

  const { value: title, errorMessage: titleError } = useField('title')
  const { value: phone, errorMessage: phoneError } = useField('phone')
  const { value: space, errorMessage: spaceError } = useField('field')
  const { value: address, errorMessage: addressError } = useField('address')
  const { value: rangeField, errorMessage: rangeFieldError } = useField('rangeField')
  const { value: rangeMin, errorMessage: rangeMinError } = useField('rangeField.min')
  const { value: rangeMax, errorMessage: rangeMaxError } = useField('rangeField.max')

  const { value: rangeDate, errorMessage: rangeDateError } = useField('rangeDate')
  const { value: dateStart, errorMessage: dateStartError } = useField('rangeDate.min')
  const { value: dateEnd, errorMessage: dateEndError } = useField('rangeDate.max')

  rangeDate.value = { min: '', max: '' }
  rangeField.value = { min: '', max: '' }

  const rangeDateErrors = computed(() => `${dateStartError.value || ''} ${dateEndError.value || ''}`.trim())
  const rangeFieldErrors = computed(() => `${rangeMinError.value || ''} ${rangeMaxError.value || ''}`.trim())

  return {
    handleSubmit,
    errors,
    title,
    phone,
    space,
    address,
    rangeField,
    rangeFieldErrors,
    rangeMin,
    rangeMax,
    rangeDate,
    rangeDateErrors,
    dateStart,
    dateEnd,
    phoneError,
    titleError,
    spaceError,
    addressError,
    rangeMinError,
    rangeMaxError,
    dateStartError,
    dateEndError
  }
}
