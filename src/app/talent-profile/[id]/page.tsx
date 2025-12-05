import TalentProfileScreen from '@/modules/telent-profile/talent-profile-screen';
import TalentSkills from '@/modules/telent-profile/talent-skills';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="min-h-screen  max-w-4xl mx-auto px-4  py-12">
      <div className="space-y-5">
        <TalentProfileScreen id={id} />
        <TalentSkills userId={id} />
      </div>
    </div>
  );
}