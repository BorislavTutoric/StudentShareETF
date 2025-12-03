import React from 'react';

function Toast({ message, type = 'success' }) {
  const getIcon = () => {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ',
    };
    return icons[type] || '•';
  };

  const getColors = () => {
    const colors = {
      success: { bg: 'rgba(96, 224, 22, 0.95)', border: '#60e016', light: 'rgba(96, 224, 22, 0.2)' },
      error: { bg: 'rgba(239, 68, 68, 0.95)', border: '#ef4444', light: 'rgba(239, 68, 68, 0.2)' },
      warning: { bg: 'rgba(245, 158, 11, 0.95)', border: '#f59e0b', light: 'rgba(245, 158, 11, 0.2)' },
      info: { bg: 'rgba(59, 130, 246, 0.95)', border: '#3b82f6', light: 'rgba(59, 130, 246, 0.2)' },
    };
    return colors[type] || colors.success;
  };

  const colors = getColors();

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(450px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(450px);
            opacity: 0;
          }
        }
      `}</style>
      <div style={{
        ...styles.toast,
        backgroundColor: colors.bg,
        borderLeftColor: colors.border,
      }}>
        <div style={{
          ...styles.icon,
          backgroundColor: colors.light,
          color: colors.border,
        }}>
          {getIcon()}
        </div>
        <span style={styles.message}>{message}</span>
      </div>
    </>
  );
}

const styles = {
  toast: {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    padding: '5px 20px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    fontSize: '15px',
    fontWeight: '600',
    color: '#ffffff',
    zIndex: 9999,
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.35)',
    animation: 'slideIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
    maxWidth: '420px',
    wordWrap: 'break-word',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderLeft: '4px solid',
    letterSpacing: '0.5px',
    transition: 'all 0.3s ease',
  },
  icon: {
    fontSize: '18px',
    fontWeight: 'bold',
    minWidth: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    flexShrink: 0,
  },
  message: {
    flex: 1,
    lineHeight: '1.5',
    fontWeight: '500',
  },
};

export default Toast;