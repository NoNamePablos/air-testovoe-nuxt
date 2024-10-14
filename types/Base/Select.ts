export namespace Select {
  export interface Option {
    id: string
    value: string
  }

  export type SelectValue = string | number | { [index: string]: string | number } | Option

  export type ModelValue = SelectValue | SelectValue[]

  export interface Model {
    modelValue?: ModelValue
    options: SelectValue[]
    name: string
    tabindex?: number
    searchValue?: string
    labelKey?: string
    label: string
    placeholder?: string
    error?: string
    hasSearch?: boolean
    isLoading?: boolean
    hasAsyncData?: boolean
    isNewValueAllowed?: boolean
    isMultiple?: boolean
    isDisabled?: boolean
    isLabelRequired?: boolean
    emptyOptionText?: string
    required?: boolean
  }

  export interface Emits {
    (event: 'update:modelValue', value: Model['modelValue']): void

    (event: 'update:searchValue', value: string): void
  }
}
