import { Metadata } from 'next';

import { AuthHeader, SigninForm } from '@/components';
import { PagePropsWithSearchParams } from '@/app/types';

export const metadata: Metadata = {
  title: 'Gamers Core | Admin | Signin',
};

export default async function Page(props: PagePropsWithSearchParams<{ from: string }>) {
  const searchParams = await props.searchParams;
  const from = searchParams.from;

  return (
    <>
      <AuthHeader title="Sign In" subtitle="Please enter your credentials to sign in." />

      <SigninForm from={from} />
    </>
  );
}
