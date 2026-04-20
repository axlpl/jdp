import React, { useState } from 'react';

import { Button, Card } from '@jutro/components';
import { InputField } from '@jutro/legacy/components';
import { useTranslator } from '@jutro/locale';

import { CompositeRequestError } from '../../services/http/compositeClient';
import { verifyCredentials } from '../../services/policyCenterApi';

import messages from './Auth.messages';
import { useAuth } from './AuthContext';

import styles from './Auth.module.scss';

type SubmitError = 'required' | 'invalid' | 'network';

export const LoginPage = () => {
    const translator = useTranslator();
    const { login, stageCredentials } = useAuth();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<SubmitError | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        const trimmed = username.trim();

        if (!trimmed || !password) {
            setError('required');

            return;
        }

        setError(null);
        setIsSubmitting(true);
        stageCredentials({ username: trimmed, password });

        try {
            await verifyCredentials();
            login({ username: trimmed, password });
        } catch (err) {
            if (
                err instanceof CompositeRequestError &&
                (err.status === 401 || err.status === 403)
            ) {
                setError('invalid');
            } else {
                setError('network');
            }
            setPassword('');
        } finally {
            stageCredentials(null);
            setIsSubmitting(false);
        }
    };

    const errorMessage: string | null = error
        ? {
              required: translator(messages.requiredFields),
              invalid: translator(messages.invalidCredentials),
              network: translator(messages.networkError),
          }[error]
        : null;

    return (
        <div className={styles.loginPage}>
            <div className={styles.loginCard}>
                <Card isPanel title={messages.pageTitle}>
                    <div className={styles.form}>
                        <p className={styles.subtitle}>
                            {translator(messages.pageSubtitle)}
                        </p>

                        <InputField
                            id="loginUsername"
                            label={messages.usernameLabel}
                            placeholder={messages.usernamePlaceholder}
                            value={username}
                            onValueChange={(value: string) =>
                                setUsername(value ?? '')
                            }
                            autoComplete="username"
                            disabled={isSubmitting}
                            required
                            showRequired
                        />

                        <InputField
                            id="loginPassword"
                            label={messages.passwordLabel}
                            value={password}
                            onValueChange={(value: string) =>
                                setPassword(value ?? '')
                            }
                            inputType="password"
                            autoComplete="current-password"
                            disabled={isSubmitting}
                            required
                            showRequired
                        />

                        {errorMessage && (
                            <p className={styles.errorText}>{errorMessage}</p>
                        )}

                        <div className={styles.actions}>
                            <Button
                                id="loginSubmit"
                                onClick={handleSubmit}
                                label={messages.loginButton}
                                disabled={isSubmitting}
                                fullWidth
                            />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};
