import { useEffect, useState } from "react";

declare global {
    interface Navigator {
        standalone?: boolean;
    }
}

export default function IOSInstallHint() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;

        if (isIOS && !isStandalone) {
            setShow(true);
        }
    }, []);

    if (!show) return null;

    return (
    <div style={{
        background: "#000",
        color: "#fff",
        padding: "10px",
        fontSize: "14px",
        textAlign: "center",
        position: "sticky",
        top: 0,
        zIndex: 1000
    }}>
        📲 Install Bookletify: open Share menu → “Add to Home Screen”
    </div>
    );
}
