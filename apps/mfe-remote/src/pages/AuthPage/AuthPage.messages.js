import { defineMessages } from '@jutro/locale';

export default defineMessages({
    loggedInAs: {
        id: 'jutro-app.pages.AuthPage.Logged in as: {name}',
        defaultMessage: 'Logged in as: {name}',
        description: 'Message to display the currently logged in user',
    },
    notLoggedIn: {
        id: 'jutro-app.pages.AuthPage.Not logged in.',
        defaultMessage: 'Not logged in.',
        description: 'Message to tell the user they are not logged in',
    },
    logOut: {
        id: 'jutro-app.pages.AuthPage.Log Out',
        defaultMessage: 'Log Out',
        description: 'Message to tell the user to log out',
    },
    logIn: {
        id: 'jutro-app.pages.AuthPage.Log In',
        defaultMessage: 'Log In',
        description: 'Message to tell the user to log in',
    },
    authDisabled: {
        id: 'jutro-app.pages.AuthPage.Authentication has been disabled.',
        defaultMessage: 'Authentication has been disabled.',
        description:
            'Message to tell the user that authentication is not enabled.',
    },
});
