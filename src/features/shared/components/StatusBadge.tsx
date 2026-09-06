import { cn } from "@lib/utils/cssStyle.lib";

const DEFAULT_STYLES: Record<string, string> = {
    Activo: "bg-teal-400/15 text-teal-600",
    Inactivo: "bg-orange-400/15 text-orange-500",
    Archivado: "bg-blue-400/15 text-blue-500",
};

interface StatusBadgeProps {
    status: string;
    statusOptions?: Record<string, string>;
    className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, statusOptions = DEFAULT_STYLES, className }) => {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize",
                statusOptions[status],
                className,
            )}
        >
            {status}
        </span>
    );
};

export default StatusBadge;
