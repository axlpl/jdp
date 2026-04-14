declare module '*.scss' {
    const content: Record<string, string>;
    export default content;
}

declare module '*.module.scss' {
    const content: Record<string, string>;
    export default content;
}

declare module '*.css' {
    const content: Record<string, string>;
    export default content;
}

declare module '*.svg' {
    const src: string;
    export default src;
}

// Align prop-types ReactElementLike.key with React 18's string | number | null.
declare module 'prop-types' {
    interface ReactElementLike {
        key: string | number | null;
    }
}
