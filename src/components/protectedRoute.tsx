import { useAuthStore } from "@/store/authstore"
import { useEffect } from "react"
import { toast } from "sonner"

export default function ProtectedRoute({ children }) {
  const isLoggedIn = useAuthStore(s => !!s.token)

  useEffect(() => {
    if (!isLoggedIn) {
      toast.warning("Please login to access this page")
      window.location.href = "/login";
    }
  }, [isLoggedIn])

  if (!isLoggedIn) return null

  return children
}
