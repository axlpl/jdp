import type { ComponentType } from 'react';

declare module '*.json' {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value: any;
    export default value;
}

declare module '*.json5' {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value: any;
    export default value;
}

declare module '*.scss' {
    const content: { [className: string]: string };
    export default content;
}

// Webpack's DefinePlugin globals
declare const __DEV__: boolean;
declare const __PROD__: boolean;
declare const __TEST__: boolean;
declare const __JUTRO_VERSION__: string;
declare const __APP_ROOT__: string;

// Helpers

type Nullable<T> = T | null;

// Now string only but it is actually only list of components in components map
type ReactComponentMetadata = string;
// Reusable type to easily replace in metadata in future
// Find better name?
/**
 * @TJS-type string
 */
type ReactComponent = ReactComponentMetadata | ComponentType;
