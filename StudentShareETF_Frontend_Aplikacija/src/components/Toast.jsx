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
      success: { bg: 'rgba(96, 224, 22, 0.95)', border: '#60e016', text: '#0a1457' },
      error: { bg: 'rgba(239, 68, 68, 0.95)', border: '#ef4444', text: '#ffffff' },
      warning: { bg: 'rgba(245, 158, 11, 0.95)', border: '#f59e0b', text: '#ffffff' },
      info: { bg: 'rgba(59, 130, 246, 0.95)', border: '#3b82f6', text: '#ffffff' },
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
        color: colors.text,
        boxShadow: `0 4px 12px rgba(96, 224, 22, 0.25)`,
      }}>
        <div style={{
          ...styles.icon,
          backgroundColor: colors.border,
          color: colors.text,
        }}>
          {getIcon()}
        </div>
        <span style={{...styles.message, color: colors.text}}>{message}</span>
      </div>
    </>
  );
}

const styles = {
  toast: {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    padding: '14px 24px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    fontSize: '15px',
    fontWeight: '600',
    zIndex: 9999,
    animation: 'slideIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
    maxWidth: '420px',
    wordWrap: 'break-word',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(96, 224, 22, 0.25)',
    borderLeft: '4px solid',
    letterSpacing: '0.5px',
    transition: 'all 0.3s ease',
  },
  icon: {
    fontSize: '20px',
    fontWeight: 'bold',
    minWidth: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    flexShrink: 0,
  },
  message: {
    flex: 1,
    lineHeight: '1.5',
    fontWeight: '600',
  },
};

export default Toast;