import React, { useState } from 'react';
import { Modal } from '@dynatrace/strato-components-preview/overlays';
import { Flex } from '@dynatrace/strato-components/layouts';
import {
  FormField,
  SelectV2,
  SelectV2Option,
  TextInput,
  TextArea,
  Hint,
  Label,
} from '@dynatrace/strato-components-preview/forms';
import { ProgressBar } from '@dynatrace/strato-components/content';
import { Text } from '@dynatrace/strato-components/typography';
import { Button } from '@dynatrace/strato-components/buttons';
import {
  GetAgentInstallerMetaInfoPathOsType,
  GetAgentInstallerMetaInfoPathInstallerType,
  GetAgentInstallerMetaInfoQueryArch,
} from '@dynatrace-sdk/client-classic-environment-v1';
import { DownloadIcon, UnfoldMoreIcon, UnfoldLessIcon } from '@dynatrace/strato-icons';
import { GEN2URL } from '../../constants';
import { useDemoMode } from '../../hooks/useDemoMode';
import { useOneAgentInstallerMeta } from '../../hooks/useOneAgentInstallerMetaInfo';
import { useDownloadOneAgent } from '../../hooks/useDownloadOneAgent';
import { useInstallerDownloadToken } from '../../hooks/useInstallerDownloadToken';
import { CopyButton } from '../CopyButton';
import { OneAgentIcon } from '../../icons/OneAgent';
import { useQueryClient } from '@tanstack/react-query';
import { CloudType } from 'src/app/types/CloudTypes';
import { updateMockHosts } from '../demo/update-mock-hosts';

const TEXTCOLS = 120;

type InstallOneagentModalProps = {
  modalOpen: boolean;
  onDismiss: () => void;
  ips: string;
  cloudType: CloudType;
};

export const InstallOneAgentModal = ({ modalOpen, onDismiss, ips, cloudType }: InstallOneagentModalProps) => {
  const demoMode = useDemoMode();
  const queryClient = useQueryClient();

  //visual states
  const [optionsOpen, setOptionsOpen] = useState(false);
  //form states
  const [mode, setMode] = useState<React.Key[]>(['infrastructure']);
  const [installerType, setInstallerType] = useState<React.Key[]>(['default']);
  const [disabledInstallerTypes, setDisabledInstallerTypes] = useState<string[]>([]);
  const [arch, setArch] = useState<React.Key[]>(['all']);
  const [disabledArchs, setDisabledArchs] = useState<string[]>([]);
  const [osType, setOsType] = useState<{ keys: React.Key[]; value: string }>({ keys: ['unix'], value: 'Linux' });
  const [networkZone, setNetworkZone] = useState<string | undefined>('');

  const { data: token } = useInstallerDownloadToken();

  const {
    data: version,
    isLoading: isInstallerMetaLoading,
    isError: isInstallerMetaError,
  } = useOneAgentInstallerMeta({
    arch: arch[0] as GetAgentInstallerMetaInfoQueryArch,
    osType: osType.keys[0] as GetAgentInstallerMetaInfoPathOsType,
    installerType: installerType[0] as GetAgentInstallerMetaInfoPathInstallerType,
  });

  const dl1Liner = `wget -O Dynatrace-OneAgent-${
    osType.value
  }-${version}.sh "${GEN2URL}/api/v1/deployment/installer/agent/${
    osType.value
  }/${installerType}/latest?arch=${arch}&flavor=default" --header="Authorization: Api-Token ${
    demoMode ? '<TOKEN_HERE>' : token
  }"`;
  const install1Liner = `/bin/sh Dynatrace-OneAgent-${osType.value}-${version}.sh --set-infra-only=false --set-app-log-content-access=true`;
  const downloadConfig = { osType: `${osType.keys[0]}`, installerType: `${installerType[0]}` };

  const { mutate: downloadOneAgent, isLoading: downloading } = useDownloadOneAgent();

  const selectOsType = (keys: React.Key[], value: string) => {
    const archs = Object.values(GetAgentInstallerMetaInfoQueryArch);
    setOsType({ keys, value });
    switch (keys[0]) {
      case 'solaris':
        setDisabledArchs(archs.filter((a) => a != 'sparc'));
        setArch(['sparc']);
        setDisabledInstallerTypes(['default']);
        setInstallerType(['paas']);
        break;
      case 'unix':
        setDisabledArchs(['sparc']);
        setArch(['x86']);
        setDisabledInstallerTypes([]);
        setInstallerType(['default']);
        break;
      case 'aix':
        setDisabledArchs(archs.filter((a) => a != 'all'));
        setArch(['all']);
        setDisabledInstallerTypes([]);
        setInstallerType(['default']);
        break;
      case 'zos':
        setDisabledArchs(archs.filter((a) => a != 'all'));
        setArch(['all']);
        setDisabledInstallerTypes(['default', 'paas-sh']);
        setInstallerType(['paas']);
        break;
      case 'windows':
        setDisabledArchs(archs.filter((a) => a != 'x86'));
        setArch(['x86']);
        setDisabledInstallerTypes(['paas-sh']);
        setInstallerType(['default']);
        break;
    }
  };

  const installOneAgentHosts = () => {
    if (demoMode) {
      updateMockHosts(queryClient, cloudType);
    } else {
      queryClient.invalidateQueries({ queryKey: ['one-agent-host', { demoMode }] });
    }
  };

  return (
    <Modal title={`Install OneAgents`} show={modalOpen} onDismiss={onDismiss} dismissible={true}>
      <Flex flexDirection='column' gap={16}>
        <Flex>
          <OneAgentIcon />
          <Text>Install OneAgents:</Text>
        </Flex>

        {/* Step 1 - Copy IP list */}
        <Flex flexDirection='row'>
          <FormField>
            <Label>IP list</Label>
            <TextArea readOnly rows={3} cols={TEXTCOLS} key={ips} defaultValue={ips} />
            <CopyButton contentToCopy={ips} />
          </FormField>
        </Flex>

        {/* Step 2 - Pick OneAgent mode */}
        <Flex flexDirection='row'>
          <FormField>
            <Label>OS Type</Label>
            <SelectV2 selectedId={osType.keys} onChange={selectOsType}>
              <SelectV2Option id='unix'>Linux</SelectV2Option>
              <SelectV2Option id='windows'>Windows</SelectV2Option>
              <SelectV2Option id='aix'>AIX</SelectV2Option>
              <SelectV2Option id='solaris'>Solaris</SelectV2Option>
              <SelectV2Option id='zos'>zOS</SelectV2Option>
            </SelectV2>
          </FormField>
          <FormField>
            <Label>OneAgent Mode</Label>
            <SelectV2
              selectedId={mode}
              onChange={(value) => value !== null && setMode(value)}
              disabledKeys={['discovery']}
            >
              <SelectV2Option id='discovery'>Discovery</SelectV2Option>
              <SelectV2Option id='infrastructure'>Infrastructure</SelectV2Option>
              <SelectV2Option id='fullstack'>FullStack</SelectV2Option>
            </SelectV2>
          </FormField>
        </Flex>

        {/* Step 4 - Pick other options, dependent on installer type */}

        <Flex flexDirection='row' as='details' open={optionsOpen} onToggle={() => setOptionsOpen((prev) => !prev)}>
          <Button as='summary' variant='default'>
            <Button.Prefix>{optionsOpen ? <UnfoldLessIcon /> : <UnfoldMoreIcon />}</Button.Prefix>
            Optional Parameters
          </Button>
          <Flex flexDirection='column' marginTop={8}>
            <FormField>
              <Label>Installer type</Label>
              <SelectV2
                name='mode'
                selectedId={installerType}
                onChange={(value) => value !== null && setInstallerType(value)}
                disabledKeys={disabledInstallerTypes}
              >
                <SelectV2Option id='default'>Default</SelectV2Option>
                <SelectV2Option id='paas'>PaaS</SelectV2Option>
                <SelectV2Option id='paas-sh'>PaaS sh</SelectV2Option>
              </SelectV2>
            </FormField>
            <FormField>
              <Label>Architecture</Label>
              <SelectV2
                selectedId={arch}
                onChange={(value) => value !== null && setArch(value)}
                disabledKeys={disabledArchs}
              >
                <SelectV2Option id='all'>Default</SelectV2Option>
                <SelectV2Option id='x86'>x86</SelectV2Option>
                <SelectV2Option id='ppc'>ppc</SelectV2Option>
                <SelectV2Option id='ppcle'>ppcle</SelectV2Option>
                <SelectV2Option id='sparc'>sparc</SelectV2Option>
                <SelectV2Option id='arm'>arm</SelectV2Option>
                <SelectV2Option id='s390'>s390</SelectV2Option>
              </SelectV2>
            </FormField>
            <FormField>
              <Label>Network Zone</Label>
              <TextInput value={networkZone} onChange={setNetworkZone} />
            </FormField>
          </Flex>
        </Flex>

        {/* Step 5 - Get agent  */}
        <Flex flexItem flexGrow={0} flexDirection='row'>
          {isInstallerMetaLoading ? (
            <ProgressBar>
              <ProgressBar.Label>Downloading Agent information...</ProgressBar.Label>
            </ProgressBar>
          ) : (
            <>
              <FormField>
                <Label>Get OneAgent</Label>
                <TextArea
                  readOnly
                  rows={2}
                  cols={TEXTCOLS}
                  key={dl1Liner}
                  defaultValue={isInstallerMetaError ? '' : dl1Liner}
                />
                {isInstallerMetaError ? (
                  <Hint hasError={isInstallerMetaError}>There was an error obtaining the agent information.</Hint>
                ) : null}
                <Flex flexDirection='row' gap={12} alignItems='center'>
                  <CopyButton contentToCopy={dl1Liner} />
                  <Text>or</Text>
                  <Button disabled={downloading} onClick={() => downloadOneAgent(downloadConfig)}>
                    <Button.Prefix>
                      <DownloadIcon />
                    </Button.Prefix>
                    Download
                  </Button>
                  {downloading ? <span>Loading...</span> : null}
                </Flex>
              </FormField>
              <FormField>
                <Label>Install 1-liner</Label>
                <TextArea
                  readOnly
                  rows={2}
                  cols={TEXTCOLS}
                  key={install1Liner}
                  value={isInstallerMetaError ? '' : install1Liner}
                  onChange={() => {
                    return;
                  }}
                />

                {isInstallerMetaError ? (
                  <Hint hasError={isInstallerMetaError}>There was an error obtaining the agent information.</Hint>
                ) : null}
                <CopyButton contentToCopy={install1Liner} onCopy={installOneAgentHosts} />
              </FormField>
            </>
          )}
        </Flex>
      </Flex>
    </Modal>
  );
};
