import React from 'react';
import { CloudType } from '../../types/CloudTypes';
import { useHostsStatus } from '../../hooks/useHostsStatus';
import { ErrorIcon } from '@dynatrace/strato-icons';
import { format } from '@dynatrace-sdk/units';

type HostsCellProps = {
  type: CloudType;
};

export const HostsCell = ({ type }: HostsCellProps) => {
  const { data, isLoading, isError } = useHostsStatus(type);

  if (isLoading) return <span>Loading...</span>;

  if (isError) return <ErrorIcon />;

  return <>{data.hosts !== undefined ? format(data.hosts) : '-'}</>;
};
