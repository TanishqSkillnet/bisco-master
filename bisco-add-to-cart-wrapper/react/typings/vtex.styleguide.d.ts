/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'vtex.styleguide' {
  import type { ComponentType } from 'react'

  export const Input: ComponentType<InputProps>
  export const Checkbox: ComponentType<InputProps>
  export const Button: ComponentType<InputProps>
  export const Collapsible: ComponentType<InputProps>
  export const Layout: ComponentType<InputProps>
  export const PageHeader: ComponentType<InputProps>
  export const PageBlock: ComponentType<InputProps>
  export const ToastProvider: ComponentType<InputProps>
  export const Spinner: ComponentType<InputProps>
  export const ToastConsumer: ComponentType<InputProps>
  export const Dropdown: ComponentType<InputProps>
  export const Modal: ComponentType<InputProps>
  export const Tabs: ComponentType<InputProps>
  export const Tab: ComponentType<InputProps>
  export const RadioGroup: ComponentType<InputProps>
  export const Textarea: ComponentType<InputProps>
  export const Pagination: ComponentType<InputProps>
  export const ModalDialog: ComponentType<InputProps>
  export const Table: ComponentType<InputProps>

  export const Tooltip: ComponentType<InputProps>
  export const DatePicker: ComponentType<InputProps>

  export const withToast

  interface InputProps {
    [key: string]: any
  }
}
