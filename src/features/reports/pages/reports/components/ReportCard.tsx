import { Download, Lock } from "lucide-react"

import { cn } from "@lib/utils/cssStyle.lib"
import { Badge } from "@components/ui/badge"
import { Button } from "@components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@components/ui/card"

import type { ReportCatalogEntry } from "../../../reportCatalog"

interface ReportCardProps {
    entry: ReportCatalogEntry;
    onGenerate: (entry: ReportCatalogEntry) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ entry, onGenerate }) => {
    const Icon = entry.icon

    return (
        <Card
            className={cn(
                "flex flex-col gap-0 py-6 rounded-xl",
                !entry.available && "opacity-70",
            )}
        >
            <CardHeader className="flex flex-row items-start justify-center gap-4 px-6">
                <div className="grid size-11 place-content-center rounded-lg bg-primary/10">
                    <Icon className="size-5 text-primary" aria-hidden="true" />
                </div>
                <Badge variant={entry.available ? "secondary" : "outline"} className="shrink-0">
                    {entry.available ? "Exportable" : "Próximamente"}
                </Badge>
            </CardHeader>
            <CardContent className="flex-1 px-6">
                <h3 className="text-base font-semibold text-card-foreground">{entry.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{entry.description}</p>
            </CardContent>
            <CardFooter className="px-6 pb-0">
                <Button
                    type="button"
                    className="w-full rounded-lg hover:cursor-pointer"
                    disabled={!entry.available}
                    onClick={() => onGenerate(entry)}
                    title={entry.available ? `Generar ${entry.title}` : "Aún no disponible"}
                >
                    {entry.available ? (
                        <>
                            <Download className="size-4" aria-hidden="true" />
                            Generar
                        </>
                    ) : (
                        <>
                            <Lock className="size-4" aria-hidden="true" />
                            Generar
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
}

export default ReportCard
