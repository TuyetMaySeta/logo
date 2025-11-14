import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <Card className="border">
            <CardContent className="p-6 space-y-4">
                <div className="text-lg font-semibold">{title}</div>
                <Separator />
                {children}
            </CardContent>
        </Card>
    );
}
