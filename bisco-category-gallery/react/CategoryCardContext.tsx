import React, {
  ReactChildren,
  ReactChild,
  useReducer,
  useContext,
  createContext,
  useEffect,
} from 'react'
import { path } from 'ramda'

export interface State {
  isLoading?: boolean
  category?: Category | undefined
}

interface SetCategory {
  type: 'ADD'
  args: { category: Category }
}

interface SetIsLoading {
  type: 'SET_IS_LOADING'
  args: { isLoading: boolean }
}

type ReducerActions = SetCategory | SetIsLoading

export type Dispatch = (action: ReducerActions) => void

const categoryReducer = (state: State, action: ReducerActions): State => {
  switch (action.type) {
    case 'ADD': {
      return {
        ...state,
        category: path(['args', 'category'], action),
      }
    }
    case 'SET_IS_LOADING': {
      return {
        ...state,
        isLoading: path(['args', 'isLoading'], action),
      }
    }
    default: {
      throw new Error(`Unhandled action type on category context`)
    }
  }
}

const DEFAULT_STATE: State = {
  isLoading: false,
  category: undefined,
}

const CategoryContext = createContext<State>(DEFAULT_STATE)
const CategoryDispatchContext = createContext<Dispatch>(action => {
  console.error('error in dispatch ', action)
})

const initialState: State = {
  isLoading: false,
  category: undefined,
}

interface Props {
  isLoading: boolean
  category: Category
  children: ReactChildren | ReactChild
}

const CategoryProvider = ({ children, category, isLoading }: Props) => {
  const [state, dispatch] = useReducer(categoryReducer, initialState)

  useEffect(() => {
    dispatch({ type: 'ADD', args: { category: category } })
    dispatch({ type: 'SET_IS_LOADING', args: { isLoading: isLoading } })
  }, [category, isLoading])

  return (
    <CategoryContext.Provider value={state}>
      <CategoryDispatchContext.Provider value={dispatch}>
        {children}
      </CategoryDispatchContext.Provider>
    </CategoryContext.Provider>
  )
}

const useCategoryState = () => useContext(CategoryContext)

const useCategoryDispatch = () => useContext(CategoryDispatchContext)

export default {
  CategoryProvider,
  useCategoryState,
  useCategoryDispatch,
}
