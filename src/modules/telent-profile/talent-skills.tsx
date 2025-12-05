import { Card } from '@/components/ui/card';
import { fetchTalentSkills } from '@/modules/main/fetch-tanelts';

interface Skill {
  id: string;
  skill: string;
  level: number;
}

interface TalentSkill {
  skill_id: string;
  skills: Skill;
}

export default async function TalentSkills({ userId }: { userId: string }) {
  const result = await fetchTalentSkills(userId);
  const skills = result.success && result.data ? result.data : [];

  if (skills.length === 0) {
    return (
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Skills</h2>
        <p className="text-gray-600">No skills added yet.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 ">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills</h2>
      <div className="space-x-2">
        {skills.map((item) => (
          <div key={item.skill_id} className="space-y-2">
            <div className="flex justify-between items-center">
              <span
                className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                {item.skill?.skill }
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}