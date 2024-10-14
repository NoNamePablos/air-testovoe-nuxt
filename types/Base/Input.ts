export namespace Input {
  export enum Types {
    TEXT = 'text',
    PHONE = 'tel'
  }

  export enum AutocompleteValues {
    OFF = 'off',
    ON = 'on'
  }

  export interface Model {
    name: string
    label?: string
    modelValue?: string | number
    placeholder?: string
    errorMessage?: string
    required?: boolean
    disabled?: boolean
    autocomplete?: AutocompleteValues
    mask?: string
    type?: Input.Types
    useDadata?: boolean
    isUppercaseFirst?: boolean
    isUppercaseAll?: boolean
    isLabelRequired?: boolean
    hasClear?: boolean
    phoneCode?: number | null
    isLoading?: boolean
  }

  export interface Emits {
    (event: 'update:modelValue', value: string | number): void
    (event: 'input', value: Event): void
    (event: 'blur'): void
  }
}
