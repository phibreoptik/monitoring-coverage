import { queryExecutionClient } from '@dynatrace-sdk/client-query';
import { useQuery } from '@tanstack/react-query';
import { ResultRecord } from '@dynatrace-sdk/client-query';

export interface VulnerabilityRecord extends ResultRecord {
  timestamp: string;
  cve: string;
  processGroup: string;
  detail: string;
}

async function fetchVulnerabilities() {
  const { result } = await queryExecutionClient.queryExecute({
    body: {
      query: `fetch security.vulnerabilities
| fields timestamp, cve, processGroup, detail = title
| sort timestamp desc`,
      requestTimeoutMilliseconds: 5000,
    },
  });
  return (result?.records ?? []) as VulnerabilityRecord[];
}

export function useVulnerabilities() {
  return useQuery({
    queryKey: ['vulnerabilities'],
    queryFn: fetchVulnerabilities,
  });
}
