import React, { useState } from 'react';

import { Button, Card } from '@jutro/components';
import { InputField } from '@jutro/legacy/components';
import { useTranslator } from '@jutro/locale';

import messages from './Auth.messages';
import { useAuth } from './AuthContext';

import styles from './Auth.module.scss';

export const LoginPage = () => {
    const translator = useTranslator();
    const { login } = useAuth();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const showError =
        submitAttempted && (!username.trim() || !password);

    const handleSubmit = () => {
        setSubmitAttempted(true);

        if (!username.trim() || !password) {
            return;
        }

        setIsSubmitting(true);
        login({ username: username.trim(), password });
    };

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

                        {showError && (
                            <p className={styles.errorText}>
                                {translator(messages.requiredFields)}
                            </p>
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
