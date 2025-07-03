import * as React from "react"

const MOBILE_BREAKPOINT = 1024 // Adjusted for better tablet support

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Initial check
    const checkDevice = () => {
      return window.innerWidth < MOBILE_BREAKPOINT
    }

    setIsMobile(checkDevice())

    const handleResize = () => {
      setIsMobile(checkDevice())
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return isMobile
}
