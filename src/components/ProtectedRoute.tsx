import { Navigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import type { ReactNode } from "react"
import { useOwner } from "@/context/OwnerContext"

interface ProtectedRouteProps {
  children: ReactNode
}

interface JwtPayload {
  exp: number
  [key: string]: any
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { token, isLoading } = useOwner()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!token) {
    return <Navigate to="/auth/login" replace />
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token)
    const now = Date.now() / 1000

    if (decoded.exp < now) {
      localStorage.removeItem("owner_token")
      return <Navigate to="/auth/login" replace />
    }

    return <>{children}</>
  } catch {
    localStorage.removeItem("owner_token")
    return <Navigate to="/auth/login" replace />
  }
}
