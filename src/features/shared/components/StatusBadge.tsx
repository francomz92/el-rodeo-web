import { cn } from "@lib/utils/cssStyle.lib";

const DEFAULT_STYLES: Record<string, string> = {
    Activo: "badge-role badge-role-ok",
    Inactivo: "badge-role badge-role-warn",
    Archivado: "badge-role badge-role-muted",
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
                "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold capitalize",
                statusOptions[status],
                className,
            )}
        >
            <span aria-hidden="true" className="badge-dot size-1.5 rounded-full" />
            {status}
        </span>
    );
};

export default StatusBadge;
