import type { Metadata } from 'next';

import { getUser } from '@/lib/supabase/server/get-user';
import { Loading } from '@/components/loading';
import { Separator } from '@/components/ui/separator';
import { Profile } from './components/profile';

export const metadata: Metadata = {
  title: 'Profile',
};

export default async function ProfilePage() {
  const user = await getUser();

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="p-8">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold">Profile</h2>
        <p className="text-muted-foreground">Manage your personal information and settings.</p>
      </div>
      <Separator className="mt-6" />
      <div className="flex justify-center mt-8 mx-auto lg:w-[640px]">
        <Profile user={user} />
      </div>
    </div>
  );
}
