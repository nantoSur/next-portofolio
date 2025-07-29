import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/dashboard/card";

export default function HeroAdminPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero Section</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This is where you will manage your hero section content.</p>
        <ul className="mt-4 list-disc list-inside text-sm text-gray-600 dark:text-gray-300">
          <li>Title</li>
          <li>Highlight (bolded word)</li>
          <li>Subtitle</li>
          <li>Description</li>
        </ul>
      </CardContent>
    </Card>
  );
}
