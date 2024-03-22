/* Typings for `render-runtime` */
declare module 'vtex.render-runtime' {
  import { Component, ReactElement } from 'react'

  export interface NavigationOptions {
    page: string
    params?: any
  }

  export interface RenderContextProps {
    runtime: {
      navigate: (options: NavigationOptions) => void
    }
  }

  export interface LinkProps {
    onClick?: (event: any) => void
    params?: object
    page?: string
    className: string
    to?: string
    query?: string
  }

  export interface NoSSRProps {
    onSSR?: React.ReactNode
  }

  export const ExtensionPoint: ReactElement
  export const Helmet: ReactElement
  export const Link: React.FunctionComponent<LinkProps>
  export const NoSSR: React.FunctionComponent<NoSSRProps>
  export const RenderContextConsumer: ReactElement
  export const canUseDOM: boolean
  export const withRuntimeContext: <TOriginalProps extends {}>(
    Component: ComponentType<TOriginalProps & RenderContextProps>
  ) => ComponentType<TOriginalProps>

  export const useRuntime: () => ComponentType<TOriginalProps>

  export const buildCacheLocator = (app: string, type: string, cacheId: string) => string

  interface RenderComponent<P = {}, S = {}> extends Component<P, S> {
    getCustomMessages?: (locale: string) => any
    schema: ComponentSchema
    getSchema?: (a: any, b: any?) => ComponentSchema
    uiSchema: UISchema
  }

  export interface ComponentsRegistry {
    [component: string]: RenderComponent<any, any>
  }

  export interface Window extends Window {
    __RENDER_7_COMPONENTS__: ComponentsRegistry
  }

  let global: Window
}
