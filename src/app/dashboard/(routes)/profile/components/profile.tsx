import { Card, CardContent } from '@/components/ui/card';
import { ProfileForm } from './profile-form';
import { ChangePasswordForm } from './change-password-form';

interface ProfileProps {
  user: User;
}

export function Profile({ user }: ProfileProps) {
  return (
    <Card className="w-full">
      <CardContent className="space-y-12">
        <ProfileForm user={user} />
        <ChangePasswordForm />
      </CardContent>
    </Card>
  );
}
