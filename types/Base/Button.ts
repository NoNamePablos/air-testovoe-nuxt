export namespace Button {
  export enum Themes {
    ERROR = 'error',
    BRAND = 'brand'
  }

  export enum Types {
    BUTTON = 'button',
    SUBMIT = 'submit',
    RESET = 'reset'
  }

  export interface Model {
    type?: Types
    disabled?: boolean
    theme?: Themes
    isLoading?: boolean
    isError?: boolean
    text?: string
  }

  export interface Emits {
    (event: 'click'): void
  }
}
