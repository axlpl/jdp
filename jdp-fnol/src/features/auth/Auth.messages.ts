import { defineMessages } from 'react-intl';

export default defineMessages({
    pageTitle: {
        id: 'jdp.auth.title',
        defaultMessage: 'Sign in',
    },
    pageSubtitle: {
        id: 'jdp.auth.subtitle',
        defaultMessage:
            'Enter your Guidewire credentials to access the FNOL portal.',
    },
    usernameLabel: {
        id: 'jdp.auth.username.label',
        defaultMessage: 'Username',
    },
    usernamePlaceholder: {
        id: 'jdp.auth.username.placeholder',
        defaultMessage: 'e.g. name@company.com',
    },
    passwordLabel: {
        id: 'jdp.auth.password.label',
        defaultMessage: 'Password',
    },
    loginButton: {
        id: 'jdp.auth.login.button',
        defaultMessage: 'Sign in',
    },
    requiredFields: {
        id: 'jdp.auth.required',
        defaultMessage: 'Please enter both username and password.',
    },
    invalidCredentials: {
        id: 'jdp.auth.invalidCredentials',
        defaultMessage:
            'The username or password is incorrect, or you do not have access to Cloud API.',
    },
    networkError: {
        id: 'jdp.auth.networkError',
        defaultMessage:
            'We could not reach PolicyCenter. Check your VPN connection and try again.',
    },
    logoutButton: {
        id: 'jdp.auth.logout.button',
        defaultMessage: 'Sign out',
    },
});
