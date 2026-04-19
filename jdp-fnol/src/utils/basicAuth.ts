export const encodeBasicAuth = (
    username: string,
    password: string
): string => {
    const bytes = new TextEncoder().encode(`${username}:${password}`);
    let binary = '';

    bytes.forEach(b => {
        binary += String.fromCharCode(b);
    });

    return btoa(binary);
};
