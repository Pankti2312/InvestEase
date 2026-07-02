import { useState, useEffect } from 'react';
import { Bell, CheckCircle, AlertCircle, Info, Clock, Check } from 'lucide-react';
import api from '../services/api';

// Central lookup configuration for notification icons and styling
const notificationConfig = {
  Action: { bg: 'bg-red-50', text: 'text-red-500', icon: AlertCircle },
  Reminder: { bg: 'bg-yellow-50', text: 'text-yellow-500', icon: Clock },
  Success: { bg: 'bg-green-50', text: 'text-green-500', icon: CheckCircle },
  Info: { bg: 'bg-blue-50', text: 'text-blue-500', icon: Info },
  Alert: { bg: 'bg-rose-50', text: 'text-rose-500', icon: AlertCircle },
  default: { bg: 'bg-navy-50', text: 'text-navy-500', icon: Bell }
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All'); // 'All' or 'Unread'

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    const previousNotifications = [...notifications];

    // Optimistically update the UI immediately
    setNotifications(notifications.map(n => 
      n._id === id ? { ...n, read: true } : n
    ));

    try {
      await api.put(`/notifications/${id}/read`);
    } catch (error) {
      // Rollback on failure
      setNotifications(previousNotifications);
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    const previousNotifications = [...notifications];

    // Optimistically update the UI immediately
    setNotifications(notifications.map(n => ({ ...n, read: true })));

    try {
      await api.put('/notifications/read-all');
    } catch (error) {
      // Rollback on failure
      setNotifications(previousNotifications);
      console.error('Failed to mark all as read:', error);
    }
  };

  const filteredNotifications = filter === 'Unread' 
    ? notifications.filter(n => !n.read) 
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) return <div>Loading notifications...</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Notifications Center</h1>
          <p className="text-navy-500">Stay updated on your investments and account actions.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="bg-navy-50 p-1 rounded-lg flex">
            <button 
              onClick={() => setFilter('All')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === 'All' ? 'bg-white shadow-sm text-navy-900' : 'text-navy-600 hover:text-navy-900'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('Unread')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${filter === 'Unread' ? 'bg-white shadow-sm text-navy-900' : 'text-navy-600 hover:text-navy-900'}`}
            >
              Unread {unreadCount > 0 && <span className="bg-teal-500 text-white text-xs px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
            </button>
          </div>
          
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="btn-secondary whitespace-nowrap hidden sm:block"
            >
              Mark All Read
            </button>
          )}
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-navy-400">
            <Bell className="w-12 h-12 mb-4 text-navy-200" />
            <p className="text-lg font-medium text-navy-600">All caught up!</p>
            <p>You have no {filter === 'Unread' ? 'unread ' : ''}notifications.</p>
          </div>
        ) : (
          <div className="divide-y divide-navy-100">
            {filteredNotifications.map((notification) => (
              <div 
                key={notification._id} 
                className={`p-4 hover:bg-navy-50/50 transition-colors flex gap-4 ${!notification.read ? 'bg-white' : 'bg-gray-50/50 opacity-80'}`}
              >
                {(() => {
                  const cfg = notificationConfig[notification.type] || notificationConfig.default;
                  const Icon = cfg.icon;
                  return (
                    <div className={`mt-1 shrink-0 p-2 rounded-full h-fit ${cfg.bg}`}>
                      <Icon className={`w-5 h-5 ${cfg.text}`} />
                    </div>
                  );
                })()}
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className={`font-semibold ${!notification.read ? 'text-navy-900' : 'text-navy-700'}`}>
                      {notification.title}
                    </h4>
                    <span className="text-xs text-navy-400 whitespace-nowrap ml-4">
                      {new Date(notification.createdAt).toLocaleString(undefined, {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className={`mt-1 text-sm ${!notification.read ? 'text-navy-600' : 'text-navy-500'}`}>
                    {notification.message}
                  </p>
                </div>
                
                {!notification.read && (
                  <button 
                    onClick={() => markAsRead(notification._id)}
                    className="shrink-0 p-2 text-teal-600 hover:bg-teal-50 rounded-full h-fit transition-colors"
                    title="Mark as read"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
