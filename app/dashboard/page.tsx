//dashboard/page
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/dashboard/primitives/card";
import Link from "next/link";
import { countHeroSection } from "@/lib/actions/hero-section/get";

export default async function DashboardPage() {
  // const [heroCount] = await Promise.all([countHeroSection()]);
  const heroCount = await countHeroSection();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Link href="/dashboard/hero-section">
        <Card className="hover:shadow-lg transition h-32 flex flex-col justify-center items-center border-t-4 border-indigo-500 bg-gradient-to-b from-indigo-50 to-white dark:from-indigo-900 dark:to-gray-900 rounded-xl">
          <CardTitle className="text-lg text-indigo-700 dark:text-indigo-300 font-semibold">
            Hero Section
          </CardTitle>
          <div className="text-sm text-indigo-600 dark:text-indigo-400 text-center px-3">
            {heroCount}
          </div>
        </Card>
      </Link>

      <Link href="/dashboard/skills">
        <Card className="hover:shadow-lg transition h-32 flex flex-col justify-center items-center border-t-4 border-purple-500 bg-gradient-to-b from-purple-50 to-white dark:from-purple-900 dark:to-gray-900 rounded-xl">
          <CardTitle className="text-lg text-purple-700 dark:text-purple-300 font-semibold">
            Skills
          </CardTitle>
          <div className="text-sm text-purple-600 dark:text-purple-400 text-center px-2">
            Manage your skills
          </div>
        </Card>
      </Link>

      <Link href="/dashboard/work-experience">
        <Card className="hover:shadow-lg transition h-32 flex flex-col justify-center items-center border-t-4 border-emerald-500 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-900 dark:to-gray-900 rounded-xl">
          <CardTitle className="text-lg text-emerald-700 dark:text-emerald-300 font-semibold">
            Work Experience
          </CardTitle>
          <div className="text-sm text-emerald-600 dark:text-emerald-400 text-center px-3">
            Manage your work history
          </div>
        </Card>
      </Link>

      <Link href="/dashboard/users">
        <Card className="hover:shadow-lg transition h-32 flex flex-col justify-center items-center border-t-4 border-rose-500 bg-gradient-to-b from-rose-50 to-white dark:from-rose-900 dark:to-gray-900 rounded-xl">
          <CardTitle className="text-lg text-rose-700 dark:text-rose-300 font-semibold">
            Users
          </CardTitle>
          <div className="text-sm text-rose-600 dark:text-rose-400 text-center px-2">
            Manage users
          </div>
        </Card>
      </Link>
    </div>
  );
}
