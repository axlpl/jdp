import React from 'react';
import { MicroFrontend } from '@jutro/micro-frontends';

export const RemoteModule = () => (
    <div style={{ padding: '16px', height: '100%', minHeight: '70vh' }}>
        <h2 style={{ marginBottom: '8px' }}>Remote module (MFE host view)</h2>
        <p style={{ marginBottom: '16px', color: '#555' }}>
            Loaded from <code>http://localhost:3002</code> via{' '}
            <code>@jutro/micro-frontends</code> — iframe mode. The host shell
            (header, nav, footer, locale, theme) you see around this box belongs
            to the host app. Only the content inside the box comes from the
            remote.
        </p>
        <div
            style={{
                border: '2px dashed #3E6485',
                borderRadius: '4px',
                padding: '4px',
                background: '#f5f8fa',
            }}
        >
            <MicroFrontend
                src="remoteDemo@http://localhost:3002"
                jutro={{
                    mode: 'isolated',
                    integrateJutro: true,
                    integrateTheme: true,
                    integrateG11n: true,
                    integrateRouter: false,
                }}
            />
        </div>
    </div>
);
