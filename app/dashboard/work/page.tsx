import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/dashboard/card";

export default function WorkAdminPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Work Experience</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This is where you will manage your work experiences.</p>
        <ul className="mt-4 list-disc list-inside text-sm text-gray-600 dark:text-gray-300">
          <li>Job title</li>
          <li>Company</li>
          <li>Year / Duration</li>
          <li>Description</li>
        </ul>
      </CardContent>
    </Card>
  );
}
