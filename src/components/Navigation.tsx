import React from 'react';
import { 
  LayoutDashboard, 
  Smile, 
  BarChart2, 
  MessageCircle, 
  Activity,
  Sun, 
  Moon 
} from 'lucide-react';
import type { AppTab } from '../types/wellness';

interface NavigationProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  activeTab, 
  setActiveTab, 
  theme, 
  toggleTheme 
}) => {
  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tracker' as const, label: 'Check-In', icon: Smile },
    { id: 'analytics' as const, label: 'Insights', icon: BarChart2 },
    { id: 'bot' as const, label: 'CalmBot', icon: MessageCircle },
    { id: 'tools' as const, label: 'Wellness Tools', icon: Activity }
  ];

  return (
    <nav className="nav-wrapper">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <div className="nav-container glass-panel">
        <div className="nav-logo-area">
          <Activity className="nav-logo-icon" size={24} />
          <span className="nav-logo-text">ZenStudy</span>
        </div>

        <div className="nav-links">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`nav-link-btn ${isActive ? 'active' : ''}`}
                aria-label={`Navigate to ${item.label}`}
                aria-current={isActive ? 'page' : undefined}
                type="button"
              >
                <Icon size={20} className="nav-icon" />
                <span className="nav-label">{item.label}</span>
                {isActive && <span className="nav-active-dot" />}
              </button>
            );
          })}
        </div>

        <div className="nav-actions">
          <button 
            onClick={toggleTheme} 
            className="theme-toggle-btn"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            type="button"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      <style>{`
        .nav-wrapper {
          width: 100%;
          margin-bottom: 24px;
          position: sticky;
          top: 16px;
          z-index: 100;
        }

        .skip-link {
          position: absolute;
          left: 24px;
          top: -48px;
          background: var(--color-primary);
          color: #fff;
          padding: 8px 12px;
          border-radius: 6px;
          transition: top 0.2s ease;
        }

        .skip-link:focus {
          top: 8px;
          z-index: 101;
        }

        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 24px;
          border-radius: 100px;
          background: rgba(20, 18, 38, 0.65);
        }

        [data-theme="light"] .nav-container {
          background: rgba(255, 255, 255, 0.75);
        }

        .nav-logo-area {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .nav-logo-icon {
          color: var(--color-secondary);
        }

        .nav-logo-text {
          font-family: var(--font-header);
          font-weight: 800;
          font-size: 1.3rem;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, var(--text-primary) 30%, var(--color-primary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .nav-link-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 50px;
          font-family: var(--font-header);
          font-weight: 500;
          font-size: 0.95rem;
          cursor: pointer;
          position: relative;
          transition: var(--transition-smooth);
        }

        .nav-link-btn:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.05);
        }

        [data-theme="light"] .nav-link-btn:hover {
          background: rgba(99, 102, 241, 0.05);
        }

        .nav-link-btn.active {
          color: var(--text-primary);
          background: rgba(99, 102, 241, 0.15);
        }

        [data-theme="light"] .nav-link-btn.active {
          background: rgba(99, 102, 241, 0.1);
          color: var(--color-primary);
        }

        .nav-active-dot {
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          background-color: var(--color-secondary);
          border-radius: 50%;
        }

        .nav-actions {
          display: flex;
          align-items: center;
        }

        .theme-toggle-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--glass-border);
          color: var(--text-primary);
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-smooth);
        }

        .theme-toggle-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: rotate(15deg);
        }

        /* Floating Bottom Nav on Mobile */
        @media (max-width: 768px) {
          .nav-wrapper {
            position: fixed;
            bottom: 16px;
            top: auto;
            left: 0;
            right: 0;
            padding: 0 16px;
            margin-bottom: 0;
          }

          .nav-container {
            padding: 8px 16px;
            box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.3);
          }

          .nav-logo-area {
            display: none;
          }

          .nav-links {
            justify-content: space-around;
            width: 85%;
          }

          .nav-link-btn {
            flex-direction: column;
            gap: 4px;
            padding: 8px 12px;
            font-size: 0.75rem;
          }

          .nav-label {
            display: none; /* Icon-only on mobile to fit screen */
          }

          .nav-link-btn.active {
            background: transparent;
            color: var(--color-primary);
          }

          .nav-active-dot {
            bottom: -2px;
            width: 5px;
            height: 5px;
          }

          .nav-actions {
            width: 15%;
            justify-content: center;
          }
        }
      `}</style>
    </nav>
  );
};
