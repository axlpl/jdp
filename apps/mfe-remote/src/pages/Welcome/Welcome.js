// @ts-check
import React from 'react';

import { Flex, FlexItem, Grid, GridItem } from '@jutro/layout';
import { Card } from '@jutro/components';

export const Welcome = () => (
    <div style={{ padding: '24px', background: '#fff7e6', minHeight: '70vh' }}>
        <Flex direction="column" alignItems="center">
            <FlexItem>
                <h1 style={{ color: '#b35c00', marginTop: '8px' }}>
                    Remote micro-frontend
                </h1>
                <p
                    style={{
                        color: '#5a4420',
                        maxWidth: '640px',
                        textAlign: 'center',
                    }}
                >
                    This is an independent Jutro app (port 3002). When loaded as
                    a standalone page you see this content with its own shell.
                    When embedded in the host via <code>@jutro/micro-frontends</code>{' '}
                    (port 3001), the host injects its own shell (header, nav,
                    footer, theme, locale) around this content.
                </p>
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
                            title="What the remote owns"
                            subTitle="Code shipped by this module"
                        >
                            <ul>
                                <li>Business pages (forms, wizards)</li>
                                <li>Domain data fetching</li>
                                <li>Module-specific state</li>
                                <li>Its own versioning / deploy cadence</li>
                            </ul>
                        </Card>
                    </GridItem>

                    <GridItem>
                        <Card
                            isPanel
                            title="What the host injects"
                            subTitle="Shared across all modules"
                        >
                            <ul>
                                <li>Auth tokens (SSO)</li>
                                <li>Theme, locale, language</li>
                                <li>Toast / modal infrastructure</li>
                                <li>Routing &amp; navigation shell</li>
                            </ul>
                        </Card>
                    </GridItem>
                </Grid>
            </FlexItem>
        </Flex>
    </div>
);
