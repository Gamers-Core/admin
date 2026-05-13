'use client';

import { usePoliciesQuery } from '@/hooks';
import { policyTypes } from '@/api';

import { PolicyCard } from './PolicyCard';

export const PoliciesList = () => {
  const policiesQuery = usePoliciesQuery();

  return (
    <section className="flex-1 flex flex-col min-w-0">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6">
        {policyTypes.map((policyType) => {
          const policy = policiesQuery.data?.[policyType];

          return <PolicyCard key={policyType} type={policyType} policy={policy} />;
        })}
      </div>
    </section>
  );
};
