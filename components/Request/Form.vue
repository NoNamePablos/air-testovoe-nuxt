<script setup lang="ts">
import { Input, Select } from '@/types'
import setPhoneMask from '@/utils/setPhoneMask'
import { v4 as uuidv4 } from 'uuid'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'

const mockOptions: Select.Option[] = [
  {
    id: uuidv4(),
    value: 'Производственная площадь'
  },
  {
    id: uuidv4(),
    value: 'Обычная площадь'
  },
  {
    id: uuidv4(),
    value: 'Другая площадь'
  }
]

const testMultiple = ref<Select.Option[]>([])

/* todo : phone code страны */
const phoneCode = ref<number>(7)

const phoneMask = computed<string>(() => `+${phoneCode.value} ${setPhoneMask(phoneCode.value)}`)

const submitForm = (values) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.info('Отправленные данные:', values)
      resolve(true)
    }, 1000)
  })
}

const {
  handleSubmit,
  title,
  phone,
  space,
  address,
  rangeField,
  rangeFieldErrors,
  rangeDate,
  rangeDateErrors,
  phoneError,
  titleError,
  spaceError,
  addressError,
  rangeMinError,
  rangeMaxError,
  dateStartError,
  dateEndError
} = useFormRequestValidation()

const onSubmit = handleSubmit(
  async (values, { setErrors }) => {
    try {
      await submitForm(values)
      console.info('Форма успешно отправлена!')
    } catch (error) {
      console.error('Ошибка при отправке формы:', error)
      if (error.response && error.response.data && error.response.data.errors) {
        const fieldErrors = error.response.data.errors
        setErrors(fieldErrors)
      } else {
        console.error('Произошла ошибка при отправке формы. Попробуйте еще раз.')
      }
    }
  },
  (validationErrors) => {
    console.error('Ошибки валидации:', validationErrors)
  }
)
</script>

<template>
  <form class="request-form" @submit="onSubmit">
    <h2 class="request-form__title text--form" v-text="$t('request_popup.title')" />
    <div class="request-form__form">
      <BaseInput
        v-model="title"
        name="request-title"
        :error-message="titleError"
        :label="$t('request_popup.fields.title')"
      />
      <BaseInput
        v-model="phone"
        name="request-phone"
        :mask="phoneMask"
        :type="Input.Types.PHONE"
        :label="$t('request_popup.fields.phone')"
        :error-message="phoneError"
      />
      <!--    todo:multiple settings base  -->
      <!--      <BaseSelect
        v-model="testMultiple"
        label-key="value"
        is-multiple
        :options="mockOptions as Select.Option[]"
        name="field-pvz"
      />-->
      <BaseSelect
        v-model="space"
        label-key="value"
        is-multiple
        :label="$t('request_popup.fields.type_place')"
        :options="mockOptions as Select.Option[]"
        name="field-pvz"
        :error="spaceError"
      />

      <BaseDadata
        v-model="address"
        name="address"
        :label="$t('request_popup.fields.address')"
        :error-message="addressError"
      />
      <BaseRange
        v-model="rangeField"
        :type="'number'"
        :label="$t('request_popup.fields.place')"
        :placeholder-min="$t('request_popup.fields.from_to_number.from')"
        :placeholder-max="$t('request_popup.fields.from_to_number.to')"
        :error-message="rangeFieldErrors"
        :error-max="rangeMaxError"
        :error-min="rangeMinError"
      />
      <BaseRange
        v-model="rangeDate"
        :type="'date'"
        :label="$t('request_popup.fields.date')"
        :placeholder-min="$t('request_popup.fields.from_to_date.from')"
        :placeholder-max="$t('request_popup.fields.from_to_date.to')"
        :error-message="rangeDateErrors"
        :error-min="dateStartError"
        :error-max="dateEndError"
      />
    </div>
    <BaseButton class="request-form__form-button" type="submit" :text="$t('request_popup.button')" />
  </form>
</template>

<style scoped lang="scss">
$white: $BASE_WHITE;

.request-form {
  display: flex;
  flex-direction: column;

  row-gap: 4rem;
  width: 80rem;
  padding: 4rem;
  background: $white;

  &__form {
    display: flex;
    flex-direction: column;
    row-gap: 2rem;
    &-button {
      margin: 0 auto;
    }
  }
}
</style>
