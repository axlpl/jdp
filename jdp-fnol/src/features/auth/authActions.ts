let logoutHandler: () => void = () => {
    /* noop until AuthProvider registers */
};

export const registerLogoutHandler = (fn: () => void): void => {
    logoutHandler = fn;
};

export const triggerLogout = (): void => {
    logoutHandler();
};
