//dashboard/page
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/dashboard/card";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <Link href="/dashboard/hero">
        <Card className="hover:shadow-lg transition">
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
          </CardHeader>
          <CardContent>
            Manage homepage hero title, subtitle, and description.
          </CardContent>
        </Card>
      </Link>

      <Link href="/dashboard/work">
        <Card className="hover:shadow-lg transition">
          <CardHeader>
            <CardTitle>Work Experience</CardTitle>
          </CardHeader>
          <CardContent>
            Manage your professional and project work history.
          </CardContent>
        </Card>
      </Link>

      <Link href="/dashboard/user">
        <Card className="hover:shadow-lg transition">
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>Manage your users.</CardContent>
        </Card>
      </Link>
    </div>
  );
}
