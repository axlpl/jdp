let logoutHandler: () => void = () => {};

export const registerLogoutHandler = (fn: () => void): void => {
    logoutHandler = fn;
};

export const triggerLogout = (): void => {
    logoutHandler();
};
