import { createContext, ReactNode, useState } from 'react'

interface IToast {
  title: string
  content: string
}

interface IToastContext {
  openToast: boolean
  toastBody: IToast
  clearToastBody: () => void
  setOpenToast: (state: boolean) => void
  onSetToastBody: (data: IToast) => void
}

interface IToastProviderProps {
  children: ReactNode
}

export const ToastContext = createContext({} as IToastContext)

const initialToastBody = {
  title: '',
  content: '',
}

export function ToastContextProvider({ children }: IToastProviderProps) {
  const [openToast, setOpenToast] = useState<boolean>(false)
  const [toastBody, setToastBody] = useState<IToast>(initialToastBody)

  function onSetToastBody(data: IToast) {
    setToastBody((state) => {
      return {
        ...state,
        ...data,
      }
    })
  }

  function clearToastBody() {
    setToastBody(initialToastBody)
  }

  return (
    <ToastContext.Provider
      value={{
        openToast,
        toastBody,
        setOpenToast,
        clearToastBody,
        onSetToastBody,
      }}
    >
      {children}
    </ToastContext.Provider>
  )
}
