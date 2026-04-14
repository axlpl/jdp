import React, {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

export type FlowContextValue<T extends object> = {
    value: T;
    getValue: <K extends keyof T>(path: K) => T[K];
    setValue: <K extends keyof T>(path: K, value: T[K]) => void;
    patch: (partial: Partial<T>) => void;
    reset: () => void;
};

const FlowContext = createContext<FlowContextValue<object> | null>(null);

type FlowProviderProps<T extends object> = {
    initialValue: T;
    storageKey?: string;
    validate?: (value: unknown) => value is Partial<T>;
    children: ReactNode;
};

const readFromStorage = <T extends object>(
    storageKey: string | undefined,
    initial: T,
    validate?: (value: unknown) => value is Partial<T>
): T => {
    if (!storageKey || typeof window === 'undefined') {
        return initial;
    }
    try {
        const raw = window.localStorage.getItem(storageKey);

        if (!raw) {
            return initial;
        }
        const parsed: unknown = JSON.parse(raw);

        if (validate && !validate(parsed)) {
            return initial;
        }

        return { ...initial, ...(parsed as Partial<T>) };
    } catch {
        return initial;
    }
};

const writeToStorage = (storageKey: string, value: unknown): void => {
    if (typeof window === 'undefined') {
        return;
    }
    try {
        window.localStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
        /* quota exceeded or private mode */
    }
};

const removeFromStorage = (storageKey: string): void => {
    if (typeof window === 'undefined') {
        return;
    }
    try {
        window.localStorage.removeItem(storageKey);
    } catch {
        /* ignore */
    }
};

export const FlowProvider = <T extends object>({
    initialValue,
    storageKey,
    validate,
    children,
}: FlowProviderProps<T>) => {
    const [value, setState] = useState<T>(() =>
        readFromStorage(storageKey, initialValue, validate)
    );

    useEffect(() => {
        if (!storageKey) {
            return;
        }
        const handle = window.setTimeout(
            () => writeToStorage(storageKey, value),
            200
        );

        return () => window.clearTimeout(handle);
    }, [value, storageKey]);

    const getValue = useCallback(
        <K extends keyof T>(path: K): T[K] => value[path],
        [value]
    );

    const setValue = useCallback(
        <K extends keyof T>(path: K, next: T[K]) => {
            setState(current =>
                Object.is(current[path], next)
                    ? current
                    : { ...current, [path]: next }
            );
        },
        []
    );

    const patch = useCallback((partial: Partial<T>) => {
        setState(current => ({ ...current, ...partial }));
    }, []);

    const reset = useCallback(() => {
        if (storageKey) {
            removeFromStorage(storageKey);
        }
        setState(initialValue);
    }, [initialValue, storageKey]);

    const ctxValue = useMemo<FlowContextValue<T>>(
        () => ({ value, getValue, setValue, patch, reset }),
        [value, getValue, setValue, patch, reset]
    );

    return (
        <FlowContext.Provider
            value={ctxValue as unknown as FlowContextValue<object>}
        >
            {children}
        </FlowContext.Provider>
    );
};

export const useFlow = <T extends object>(): FlowContextValue<T> => {
    const ctx = useContext(FlowContext);

    if (!ctx) {
        throw new Error('useFlow must be used within <FlowProvider>');
    }

    return ctx as unknown as FlowContextValue<T>;
};
