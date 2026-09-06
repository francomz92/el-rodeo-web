import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";

interface ListPaginationProps {
    show: boolean;
    totalPages: number;
    currentPage: number;
    onNext: () => void;
    onPrevious: () => void;
    toPage: (page: number) => void;
    hideDisabledButtons?: boolean;
}

const ListPagination: React.FC<ListPaginationProps> = ({
    show,
    totalPages,
    currentPage,
    onNext,
    onPrevious,
    toPage,
    hideDisabledButtons = false,
}) => {
    if (!show) return null;
    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem className={hideDisabledButtons && currentPage === 1 ? "hidden" : undefined}>
                    <PaginationPrevious isActive={currentPage > 1} onClick={() => onPrevious()} />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                        <PaginationLink isActive={page === currentPage} onClick={() => toPage(Number(page))}>
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                ))}
                <PaginationItem className={hideDisabledButtons && currentPage === totalPages ? "hidden" : undefined}>
                    <PaginationNext isActive={currentPage < totalPages} onClick={() => onNext()} />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};

export default ListPagination;
