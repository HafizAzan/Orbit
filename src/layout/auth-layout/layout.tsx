import { ConfigProvider } from 'antd';
import React from 'react';
import { Outlet } from 'react-router-dom';

function AuthLayout() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#4f46e5',
          borderRadius: 8,
          controlHeight: 44,
          fontFamily: '"Space Grotesk", ui-sans-serif, system-ui, sans-serif',
        },
      }}
    >
      <div className="min-h-screen bg-card">
        <Outlet />
      </div>
    </ConfigProvider>
  );
}

export default React.memo(AuthLayout);
