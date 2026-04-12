// @ts-check
import React from 'react';

import { Flex, FlexItem, Grid, GridItem } from '@jutro/layout';
import { Card, Image } from '@jutro/components';
import { useTranslator } from '@jutro/locale';
import { Link } from '@jutro/router';

import packageJson from '../../../package.json';

import messages from './Welcome.messages';

import styles from './Welcome.module.scss';

/**
 *
 * @param {string} version - The package.json version property
 * @returns {object} - Jutro version and Jutro component URI corresponding to Jutro Version provided
 */
export const getJutroVersion = version => {
    if (version.includes('-next')) {
        return {
            version: 'Master (not released)',
            jutroComponentsURI: `https://jutro-master.int.ccs.guidewire.net/jutro-storybook`,
        };
    }

    return {
        version,
        jutroComponentsURI: `https://jutro-${version.replace(
            /\./g,
            '-'
        )}.int.ccs.guidewire.net/jutro-storybook`,
    };
};

export const Welcome = () => {
    const translator = useTranslator();

    const { version, jutroComponentsURI } = getJutroVersion(
        packageJson.version
    );

    return (
        <div className={styles.welcome}>
            <Flex direction="column" alignItems="center">
                <FlexItem>
                    <Image
                        id="welcomeHeader1"
                        className={styles.image}
                        src="images/jutro.svg"
                        width={500}
                        alt={translator(messages.welcomeImage)}
                    />
                </FlexItem>

                <FlexItem>
                    <Grid
                        gap="large"
                        columns={['1fr', '1fr']}
                        justifyContent="center"
                    >
                        <GridItem>
                            <Card
                                isPanel
                                title={translator(messages.whereToStart)}
                                subTitle={translator(messages.weSuggestSteps)}
                                className={styles.card}
                            >
                                <ol>
                                    <li>
                                        {translator(messages.checkTheForm, {
                                            a: chunks => (
                                                <Link to="/forms/codeless">
                                                    {chunks}
                                                </Link>
                                            ),
                                        })}
                                    </li>

                                    <li>
                                        {translator(messages.reviewAppJs, {
                                            filename: `'./src/app/App.js'`,
                                        })}
                                    </li>

                                    <li>
                                        {translator(messages.goThroughReadme, {
                                            filename: `'./README.md'`,
                                        })}
                                    </li>
                                </ol>
                            </Card>
                        </GridItem>

                        <GridItem>
                            <Card
                                isPanel
                                title={translator(messages.needHelp)}
                                subTitle={translator(messages.supportAndDocs)}
                                className={styles.card}
                            >
                                <ul>
                                    <li>
                                        {translator(
                                            messages.needSupportStorybook,
                                            {
                                                linkLabel: translator(
                                                    messages.jutroVersion,
                                                    { version }
                                                ),
                                                a: chunks => (
                                                    <Link
                                                        href={
                                                            jutroComponentsURI
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {chunks}
                                                    </Link>
                                                ),
                                            }
                                        )}
                                    </li>

                                    <li>
                                        {translator(
                                            messages.forDevelopersSupport,
                                            {
                                                channel: '#ask-jutro',
                                                a: chunks => (
                                                    <Link
                                                        href="https://slack.com/app_redirect?channel=CGGTRG8MQ"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {chunks}
                                                    </Link>
                                                ),
                                            }
                                        )}
                                    </li>

                                    <li>
                                        {translator(
                                            messages.forDesignersSupport,
                                            {
                                                channel: '#ask-jutro-design',
                                                a: chunks => (
                                                    <Link
                                                        href="https://slack.com/app_redirect?channel=CMHBKTNLC"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {chunks}
                                                    </Link>
                                                ),
                                            }
                                        )}
                                    </li>

                                    <li>
                                        {translator(messages.moreDetails, {
                                            a: chunks => (
                                                <Link
                                                    href="https://docs.guidewire.com/jutro/documentation/latest"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {chunks}
                                                </Link>
                                            ),
                                        })}
                                    </li>
                                </ul>
                            </Card>
                        </GridItem>
                    </Grid>
                </FlexItem>
            </Flex>
        </div>
    );
};
