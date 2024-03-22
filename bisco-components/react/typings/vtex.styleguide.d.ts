declare module 'vtex.styleguide' {
  import { ReactElement, ComponentType } from 'react'

  export interface SpinnerProps {
    color?: string
    size?: number
    block?: boolean
  }

  export interface TableProps {
    schema: any
    items: any[]
    density: String
    emptyStateLabel: String
  }

  export interface ModalProps{
    isOpen?: boolean
    onClose?: (e: any) => void

  }

  export interface ButtonProps {
    size?: string
    variation?: string
    block?: boolean
    isLoading?: boolean
    icon?: boolean
    iconOnly?: boolean
    id?: string
    autoFocus?: boolean
    autoComplete?: string
    disabled?: boolean
    forwardedRef?: any
    name?: string
    type?: string
    value?: string
    onClick?: (e: any) => void
    href?: string
    onMouseEnter?: (e: any) => void
    onMouseLeave?: (e: any) => void
    onMouseOver?: (e: any) => void
    onMouseOut?: (e: any) => void
    onMouseUp?: (e: any) => void
    onMouseDown?: (e: any) => void
    collapseLeft?: boolean
    collapseRight?: boolean
    isGrouped?: boolean
    isFirstOfGroup?: boolean
    isLastOfGroup?: boolean
    isActiveOfGroup?: boolean
    target?: string
    rel?: string
    referrerPolicy?: string
    download?: string
  }

  export interface ButtonGroupProps {
    buttons?: any[]
  }

  export interface InputProps {
    error?: boolean
    errorMessage?: string
    forwardedRef?: any
    token?: boolean
    size?: string
    label?: string
    accept?: string
    disabled?: boolean
    autoComplete?: string
    autoCorrect?: string
    autoFocus?: boolean
    autoSave?: string
    dataAttributes?: any
    defaultValue?: string
    groupBottom?: boolean
    id?: string
    inputMode?: string
    list?: string
    max?: string
    maxLength?: string | number
    min?: string
    minLength?: string
    multiple?: boolean
    name?: string
    pattern?: string
    placeholder?: string
    readOnly?: boolean
    required?: boolean
    spellCheck?: string
    src?: string
    step?: string
    tabIndex?: string
    type?: string
    value?: string
    onChange?: (e: any) => void
    onKeyDown?: (e: any) => void
    onKeyPress?: (e: any) => void
    onKeyUp?: (e: any) => void
    onFocus?: (e: any) => void
    onBlur?: PropTypes.func
  }

  export const Alert: ReactElement
  export const Checkbox: ReactElement
  export const Badge: ReactElement
  export const Box: ReactElement
  export const Button: React.FunctionComponent<ButtonProps>
  export const ButtonGroup: React.FunctionComponent<ButtonGroupProps>
  export const Card: ReactElement
  export const Dropdown: ReactElement
  export const EmptyState: ReactElement
  export const IconArrowBack: ReactElement
  export const IconArrowUp: ReactElement
  export const IconEdit: ReactElement
  export const Input: React.FunctionComponent<InputProps>
  export const PageHeader: ReactElement
  export const Pagination: ReactElement
  export const Radio: ReactElement
  export const Spinner: React.FunctionComponent<SpinnerProps>
  export const Tab: ComponentType<Record<string, unknown>>
  export const Tabs: ComponentType<Record<string, unknown>>
  export const Toggle: ReactElement
  export const Layout: ReactElement
  export const PageBlock: ReactElement
  export const Modal: React.FunctionComponent<ModalProps>
  export const Table: React.FunctionComponent<TableProps>
}
