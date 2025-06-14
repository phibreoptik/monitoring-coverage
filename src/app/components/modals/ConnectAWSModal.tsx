import React, { FormEvent, useRef, useState } from 'react';
import { Modal } from '@dynatrace/strato-components-preview/overlays';
import {
  FormField,
  TextInput,
  SelectV2,
  SelectV2Option,
  PasswordInput,
  Button,
  FieldSet,
  Label,
} from '@dynatrace/strato-components-preview/forms';
import { Flex } from '@dynatrace/strato-components/layouts';
import { Text } from '@dynatrace/strato-components/typography';
import { Cloud } from '../../types/CloudTypes';
import { useAWSCredentials } from '../../hooks/useAWSCredentials';

type ConnectAWSModalProps = {
  modalOpen: boolean;
  onDismiss: () => void;
  selectedCloud?: Cloud;
};

export const ConnectAWSModal = ({ modalOpen, onDismiss, selectedCloud }: ConnectAWSModalProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [auth, setAuth] = useState<React.Key[] | null>(['ROLE']);

  const { mutate } = useAWSCredentials();

  function submit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      mutate(formData, {
        onSuccess: () => {
          onDismiss();
        },
      });
    }
    onDismiss();
  }

  return (
    <Modal title={`Add ${selectedCloud?.cloud} integration`} show={modalOpen} onDismiss={onDismiss}>
      <form ref={formRef} onSubmit={submit}>
        <Flex flexDirection='column' gap={16}>
          <Flex flexDirection='row'>
            <Text>
              {selectedCloud?.icon && <img src={`./assets/` + selectedCloud.icon} className='iconStyle' />}
              &nbsp; Add {selectedCloud?.cloud} integration:
            </Text>
          </Flex>
          <FormField>
            <Label required>Connection name</Label>
            <TextInput placeholder='For example, Dynatrace integration' name='name' />
          </FormField>
          <FieldSet name='authenticationData'>
            <FormField>
              <Label required>Authentication method</Label>
              <SelectV2 name='auth' onChange={setAuth} selectedId={auth}>
                <SelectV2Option id='KEYS' value='KEYS'>
                  Key-based authentication
                </SelectV2Option>
                <SelectV2Option id='ROLE' value='ROLE'>
                  Role-based authentication
                </SelectV2Option>
              </SelectV2>
            </FormField>
          </FieldSet>
          {auth?.includes('KEYS') ? (
            <Flex flexDirection='column' gap={16}>
              <SelectV2 defaultSelectedId={['AWS_DEFAULT']} name='partition'>
                <SelectV2Option id='AWS_DEFAULT' value='AWS_DEFAULT'>
                  Default
                </SelectV2Option>
                <SelectV2Option id='AWS_US_GOV' value='AWS_US_GOV'>
                  US Gov
                </SelectV2Option>
                <SelectV2Option id='AWS_CN' value='AWS_CN'>
                  China
                </SelectV2Option>
              </SelectV2>
              <FormField>
                <Label required>Access Key ID</Label>
                <TextInput placeholder='Access key' name='accessKeyId' required />
              </FormField>
              <FormField>
                <Label required>Secret access key</Label>
                <PasswordInput placeholder='Secret key' name='secretKeyId' required />
              </FormField>
            </Flex>
          ) : (
            <input type='hidden' value='AWS_DEFAULT' name='partition' />
          )}
          {auth?.includes('ROLE') && (
            <Flex flexDirection='column' gap={16}>
              <FormField>
                <Label>IAM role that Dynatrace should use to get monitoring data</Label>
                <TextInput placeholder='Role for this connection' name='role' />
              </FormField>
              <FormField>
                <Label>Your Amazon account ID</Label>
                <TextInput placeholder='Account ID' name='accountId' />
              </FormField>
              <FormField>
                <Label>Token (use this value as the External ID for your IAM role)</Label>
                <PasswordInput placeholder='********************' name='externalId' />
              </FormField>
            </Flex>
          )}
          <Flex flexGrow={0} justifyContent='flex-end'>
            <Button variant='emphasized' type='submit'>
              Connect
            </Button>
          </Flex>
        </Flex>
      </form>
    </Modal>
  );
};
