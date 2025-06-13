import { Page, AppHeader, Flex } from '@dynatrace/strato-components-preview';
import React from 'react';
import { VulnerabilityTable } from './components/VulnerabilityTable';

export const App = () => {
  return (
    <Page>
      <Page.Header>
        <AppHeader>
          <AppHeader.Title>Vulnerability management</AppHeader.Title>
        </AppHeader>
      </Page.Header>
      <Page.Main>
        <Flex flexDirection='column' width='100%' gap={24} style={{ overflowX: 'auto' }}>
          <div style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', width: 1280 }}>
            <VulnerabilityTable />
          </div>
        </Flex>
      </Page.Main>
    </Page>
  );
};
