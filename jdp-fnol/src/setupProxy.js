const { createProxyMiddleware } = require('http-proxy-middleware');

const stripRequestCookies = proxyReq => proxyReq.removeHeader('cookie');

module.exports = function setupProxy(app) {
    const { PC_PROXY_TARGET, CC_PROXY_TARGET } = process.env;

    const mount = (path, target, rewritePrefix) => {
        if (!target) {
            return;
        }

        app.use(
            path,
            createProxyMiddleware({
                target,
                changeOrigin: true,
                pathRewrite: { [`^${rewritePrefix}`]: '' },
                onProxyReq: stripRequestCookies,
            })
        );
    };

    mount('/pc', PC_PROXY_TARGET, '/pc');
    mount('/cc', CC_PROXY_TARGET, '/cc');
};
