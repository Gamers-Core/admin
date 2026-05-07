import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { AuthHeader, VerifyOTPForm } from '@/components';
import { PagePropsWithSearchParams } from '@/app/types';

export const metadata: Metadata = {
  title: 'Gamers Core | Verify OTP',
  description: 'Verify your OTP to complete the sign-in process.',
};

export default async function Page(props: PagePropsWithSearchParams<{ sessionId: string; from?: string }>) {
  const searchParams = await props.searchParams;

  const sessionId = searchParams.sessionId;
  const from = searchParams.from;

  const params = new URLSearchParams();
  if (from) params.append('from', from);

  if (!sessionId) redirect(`/signin?${params.toString()}`);

  return (
    <>
      <AuthHeader title="Verify OTP" subtitle="Please enter the OTP sent to your email or phone." />

      <VerifyOTPForm sessionId={sessionId} from={from} />
    </>
  );
}
