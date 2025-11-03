import { useEffect, useState } from "react"
import Button from "@mui/material/Button"
import SmartphoneIcon from "@mui/icons-material/Smartphone"

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPWAButton() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
    const [isInstallable, setIsInstallable] = useState(false)

    useEffect(() => {
        const handler = (e: Event) => {
            const event = e as BeforeInstallPromptEvent
            event.preventDefault()
            setDeferredPrompt(event)
            setIsInstallable(true)
        }

        window.addEventListener("beforeinstallprompt", handler)
        return () => window.removeEventListener("beforeinstallprompt", handler)
    }, [])

    const handleInstall = async () => {
        if (!deferredPrompt) return

        deferredPrompt.prompt()
        await deferredPrompt.userChoice
        setDeferredPrompt(null)
        setIsInstallable(false)
    }

    if (!isInstallable) return null

    return (
        <Button 
        variant="contained"
        color="primary"
        startIcon={<SmartphoneIcon />}
        onClick={handleInstall}
        >
            Install App
        </Button>
    )
}
