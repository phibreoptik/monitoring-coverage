import React from 'react';
import { CloudType } from 'src/app/types/CloudTypes';
import { coverageRatio } from './coverage-ratio';
import { useHostsStatus } from 'src/app/hooks/useHostsStatus';
import { useOneAgentHosts } from 'src/app/hooks/useOneAgentHosts';
import { WarningIcon, SyncIcon } from '@dynatrace/strato-icons';
import { Button } from '@dynatrace/strato-components/buttons';
import { OneAgentIcon } from 'src/app/icons/OneAgent';

type ActionsCellProps = {
  type: CloudType;
  onClick: (value: 'install-oneagents' | 'connect-cloud') => void;
};

//Temporary styling until upstream bug fix
const TMP_BUTTON_TEXT_STYLE = {
  minWidth: 120,
};

export const ActionsCell = ({ type, onClick }: ActionsCellProps) => {
  const status = useHostsStatus(type);
  const oneagent = useOneAgentHosts();

  const isLoading = status.isLoading || oneagent.isLoading;
  const isError = status.isError || oneagent.isError;

  if (isLoading) return null;

  if (isError) return <WarningIcon />;

  const coverage = coverageRatio(status.data, oneagent.data[type]);

  if (!status.data.status || coverage > 100) {
    return (
      <Button width='full' variant='accent' onClick={() => onClick('connect-cloud')}>
        <Button.Prefix>
          <SyncIcon />
        </Button.Prefix>
        <div style={TMP_BUTTON_TEXT_STYLE}>Connect cloud</div>
      </Button>
    );
  }
  if (coverage < 100) {
    return (
      <Button width='full' variant='emphasized' onClick={() => onClick('install-oneagents')}>
        <Button.Prefix>
          <OneAgentIcon />
        </Button.Prefix>
        <div style={TMP_BUTTON_TEXT_STYLE}>Install OneAgents</div>
      </Button>
    );
  }
  return <>-</>;
};
