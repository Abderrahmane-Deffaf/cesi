"use client"
import { useRouter } from 'next/navigation';
import { signOutAction } from './sign-out-action';
import { Button } from './ui/button';

export default function SignOutButton() {

  const router = useRouter()

  const handleSignOut = async () => {
    await signOutAction();
    router.push('/');
  };

  return (
    <Button
      variant="ghost"
      onClick={handleSignOut}
      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
    >
      Sign Out
    </Button>
  );
}
