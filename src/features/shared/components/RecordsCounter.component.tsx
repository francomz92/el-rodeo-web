import { cn } from "@utils/cssStyle.lib";

import { computeRecordsRange, formatRecordsRange } from "./paginationState";

interface RecordsCounterProps {
    /** Rows already shown before this page (offset of the request). */
    offset: number;
    /** Rows currently displayed. */
    count: number;
    /** Total rows matching the filters (S3). */
    total: number;
    className?: string;
}

/** "X–Y de Z registros" (S3): rows shown over the filtered total. */
const RecordsCounter: React.FC<RecordsCounterProps> = ({ offset, count, total, className }) => {
    if (count <= 0) return null;
    return (
        <p className={cn("text-sm text-muted-foreground", className)}>
            {formatRecordsRange(computeRecordsRange(offset, count, total))}
        </p>
    );
};

export default RecordsCounter;
