declare module 'vtex.styleguide' {
  import { ComponentType } from 'react'

  export const Input: ComponentType<InputProps>
  export const Spinner: ComponentType<InputProps>
  export const Dropdown: ComponentType<InputProps>
  export const Tooltip: ComponentType<InputProps>
  export const Button: ComponentType<InputProps>

  interface InputProps {
    [key: string]: any
  }
}
