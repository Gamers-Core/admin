'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { History, PencilEdit02Icon } from '@hugeicons/core-free-icons';

import { Policy, PolicyType, localeDir, locales, policyTypeLabels } from '@/api';
import { Disclosure, useDisclosure, useFormatDate, usePolicyHistoryQuery } from '@/hooks';
import { cn } from '@/lib/utils';

import { PolicyFormModal } from './PolicyFormModal';
import { Button } from '../Button';
import { Modal } from '../Modal';
import { HTMLRender } from '../HTMLRender';

interface PolicyCardProps {
  preview?: boolean;
  type: PolicyType;
  policy?: Policy;
}

export const PolicyCard = ({ preview = false, type, policy }: PolicyCardProps) => {
  const formatDate = useFormatDate();

  const updateModalDisclosure = useDisclosure();
  const previewModalDisclosure = useDisclosure();
  const policyHistoryDisclosure = useDisclosure();

  const policyHistoryQuery = usePolicyHistoryQuery(type);

  const history = policyHistoryQuery.data?.slice(1)[0];

  return (
    <div className="flex flex-col gap-4 items-center">
      <Button
        onClick={previewModalDisclosure.onOpen}
        variant="ghost"
        className="flex flex-col gap-2 py-10 px-6 bg-border rounded-lg h-auto text-start w-full"
      >
        <span className="text-base md:text-lg lg:text-xl font-bold ">{policyTypeLabels[type]}</span>
        {policy && (
          <>
            <span className="text-sm text-muted-foreground">{formatDate(policy.updatedAt, 'dd/MM/yyyy hh:mm a')}</span>

            <span className="text-sm text-muted-foreground">version {policy.version}</span>
          </>
        )}
      </Button>

      {policy && <PolicyModal {...previewModalDisclosure} policy={policy} policyType={type} />}

      {!preview && (
        <div className="flex gap-2">
          <div>
            <Button icon={<HugeiconsIcon icon={PencilEdit02Icon} />} onClick={updateModalDisclosure.onOpen} />

            <PolicyFormModal disclosure={updateModalDisclosure} policy={policy} policyType={type} />
          </div>

          {history && (
            <div>
              <Button
                variant="secondary"
                isDisabled={!policyHistoryQuery.isSuccess || policyHistoryQuery.data.length === 0}
                icon={<HugeiconsIcon icon={History} />}
                onClick={policyHistoryDisclosure.onOpen}
              />

              <PolicyModal policy={history} policyType={type} {...policyHistoryDisclosure} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface PolicyModalProps extends Disclosure {
  policyType: PolicyType;
  policy: Policy;
}

const PolicyModal = ({ policy, policyType, ...disclosure }: PolicyModalProps) => {
  const formatDate = useFormatDate();

  return (
    <Modal
      {...disclosure}
      title={policyTypeLabels[policyType]}
      description={`Version: ${policy.version} - Updated at ${formatDate(policy.updatedAt, 'dd/MM/yyyy hh:mm a')}`}
      className="flex flex-col gap-2"
      fullscreen
    >
      {locales.map(
        (locale) =>
          policy.value[locale] && (
            <div
              key={locale}
              dir={localeDir[locale]}
              className={cn('text-sm text-muted-foreground text-start w-full bg-muted rounded-lg p-4', {
                'font-cairo': localeDir[locale] === 'rtl',
              })}
            >
              <PolicyAnswerHTML html={policy.value[locale]} />
            </div>
          ),
      )}
    </Modal>
  );
};

const PolicyAnswerHTML = HTMLRender('PolicyAnswer');
