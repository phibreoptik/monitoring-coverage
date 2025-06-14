import React, { Dispatch, SetStateAction } from 'react';
import { Modal } from '@dynatrace/strato-components-preview/overlays';
import { FormField, TextInput, Label } from '@dynatrace/strato-components-preview/forms';
import { Button } from '@dynatrace/strato-components/buttons';
import { Flex } from '@dynatrace/strato-components/layouts';
import { Text } from '@dynatrace/strato-components/typography';
import { ExternalLinkIcon } from '@dynatrace/strato-icons';
import { Cloud } from '../../types/CloudTypes';
import { useDemoMode } from '../../hooks/useDemoMode';
import { GEN2URL } from '../../constants';
import { useQueryClient } from '@tanstack/react-query';
import { updateMockData } from '../demo/update-mock-data';

type ConnectCloudModalProps = {
  modalOpen: boolean;
  onDismiss: () => void;
  selectedCloud: Cloud;
};

export const ConnectCloudModal = ({ modalOpen, onDismiss, selectedCloud }: ConnectCloudModalProps) => {
  const demoMode = useDemoMode();

  const url = GEN2URL + selectedCloud.setupPath;

  const queryClient = useQueryClient();

  return (
    <Modal title={`Add ${selectedCloud.cloud} integration`} show={modalOpen} onDismiss={onDismiss}>
      <Flex flexDirection='column' gap={16}>
        <Flex flexDirection='row'>
          <Text>
            {selectedCloud.icon && <img src={`./assets/` + selectedCloud.icon} />}
            &nbsp; Add {selectedCloud.cloud} integration:
          </Text>
        </Flex>
        {demoMode && (
          <Flex flexDirection='column' gap={16}>
            <FormField>
              <Label>(Mock)</Label>
              <FormField>
                <Label>API URL</Label>
                <TextInput placeholder='https://xxx.xxxxxxxx.xxx/xxx' />
              </FormField>
              <FormField>
                <Label>API Key</Label>
                <TextInput placeholder='xxxxxxxxxxxxxxxxxxxxxxxxxxxx' />
              </FormField>
            </FormField>
          </Flex>
        )}
        <Flex flexGrow={0} justifyContent='flex-end'>
          {demoMode ? (
            <Button
              variant='emphasized'
              onClick={() => {
                if (selectedCloud) {
                  updateMockData(queryClient, selectedCloud.cloudType);
                }
                onDismiss();
              }}
            >
              Connect
            </Button>
          ) : (
            <Button as='a' target='_blank' href={url} variant='emphasized'>
              {selectedCloud.cloudType == 'VMWare' ? 'Settings' : 'Hub'}
              <Button.Suffix>
                <ExternalLinkIcon />
              </Button.Suffix>
            </Button>
          )}
          <Button variant='default' onClick={onDismiss}>
            Done
          </Button>
        </Flex>
      </Flex>
    </Modal>
  );
};
