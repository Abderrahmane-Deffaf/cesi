import Link from "next/link";
import { Button } from "@/components/ui/button";
import TalentMap from "@/modules/main/talent-map";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">CESI</h1>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to CESI Talent Platform
          </h2>
          <p className="text-lg text-gray-600">
            Manage your skills, projects, and showcase your talents
          </p>
        </div>
        <TalentMap />
      </main>
    </div>
  );
}
