import { Card } from '@/components/ui/card';
import { fetchTalentById } from '@/modules/main/fetch-tanelts';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import TalentSkills from './talent-skills';

interface Talent {
  name: string;
  prenom: string;
  email: string;
  lat: number;
  long: number;
  adresse: string;
  passion: string;
  is_verified: boolean | null;
  user_id: string;
  skills_ids?: string;
  languages_ids?: string;
  projects_ids?: string;
}

export default async function TalentProfileScreen({ id }: { id: string }) {
  const result = await fetchTalentById(id);
  const talent = result.success && result.data ? result.data : null;

  if (!talent) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-lg text-red-600">Talent not found</p>
        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  const passions = talent.passion ? talent.passion.split(',').map(p => p.trim()) : [];

  return (
    <div >
      <div >
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/">← Back to Map</Link>
        </Button>

        <Card className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {talent.prenom} {talent.name}
              </h1>
              {talent.is_verified && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  ✓ Verified
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Contact Information</h2>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span> {talent.email}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Address:</span> {talent.adresse}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Location</h2>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Latitude:</span> {talent.lat}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Longitude:</span> {talent.long}
                </p>
              </div>
            </div>
          </div>

          {passions.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">Passions & Interests</h2>
              <div className="flex flex-wrap gap-2">
                {passions.map((passion: string, index:number) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {passion}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}