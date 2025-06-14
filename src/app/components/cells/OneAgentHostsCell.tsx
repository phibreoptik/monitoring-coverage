import React from 'react';
import { CloudType } from '../../types/CloudTypes';
import { WarningIcon } from '@dynatrace/strato-icons';
import { format } from '@dynatrace-sdk/units';
import { useOneAgentHosts } from 'src/app/hooks/useOneAgentHosts';

type OneAgentHostsCellProps = {
  type: CloudType;
};

export const OneAgentHostsCell = ({ type }: OneAgentHostsCellProps) => {
  const { data, isLoading, isError } = useOneAgentHosts();

  if (isLoading) return null;

  if (isError) return <WarningIcon />;

  return <>{data[type] !== undefined ? format(data[type] || 0) : '-'}</>;
};
