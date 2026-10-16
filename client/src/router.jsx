/* eslint react-refresh/only-export-components: off */
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const RouterContext = createContext({ path: '/', navigate: () => {} })

export function RouterProvider({ children }) {
  const [path, setPath] = useState(`${window.location.pathname}${window.location.search}`)

  useEffect(() => {
    const onPopState = () => setPath(`${window.location.pathname}${window.location.search}`)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const navigate = useCallback((to, options = {}) => {
    if (options.replace) window.history.replaceState({}, '', to)
    else window.history.pushState({}, '', to)
    setPath(`${window.location.pathname}${window.location.search}`)
    if (!options.keepScroll) window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const onExpired = () => navigate('/admin/login', { replace: true })
    window.addEventListener('me-auth-expired', onExpired)
    return () => window.removeEventListener('me-auth-expired', onExpired)
  }, [navigate])

  return <RouterContext.Provider value={{ path, navigate }}>{children}</RouterContext.Provider>
}

export function useRouter() { return useContext(RouterContext) }

export function Link({ to, children, onClick, ...props }) {
  const { navigate } = useRouter()
  return <a href={to} {...props} onClick={(event) => {
    onClick?.(event)
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    navigate(to)
  }}>{children}</a>
}
