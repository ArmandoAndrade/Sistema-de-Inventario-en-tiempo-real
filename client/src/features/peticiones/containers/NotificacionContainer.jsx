import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import { NotificacionView } from "../components/NotificacionView.jsx";

export const NotificacionContainer = () => {

    const {
        notifications,
        markNotificationAsRead,
        removeNotification,
        isSocketConnected,
        clearNotifications
    } = useAuth();

    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const unreadCount = notifications.filter(n => !n.read).length;

    // Cerrar notificaciones automáticamente después de 30 segundos
    useEffect(() => {
        let timer;
        if (notifications.length > 0 && !isPanelOpen) {
            const timer = setTimeout(() => {
                notifications.forEach(n => {
                    if (!n.read) markNotificationAsRead(n.id);
                });
            }, 30000);
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [notifications, isPanelOpen, markNotificationAsRead]);

    const handleNotificationClick = (id) => {
        markNotificationAsRead(id);
        setIsPanelOpen(false);
    }

    const handleRemoveNotification = (id, e) => {
        e.stopPropagation();
        removeNotification(id);
    }

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    }


    return (
        <div>
            <NotificacionView
                isSocketConnected={isSocketConnected}
                notifications={notifications}
                unreadCount={unreadCount}
                isPanelOpen={isPanelOpen}
                onNotificationClick={handleNotificationClick}
                onRemoveNotification={handleRemoveNotification}
                onTogglePanel={togglePanel}
                onClearAll={clearNotifications}
            />
        </div>
    )
}

export default NotificacionContainer