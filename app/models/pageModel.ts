export type Page<Type> = {
    content: Type[];
    isFirstPage: boolean;
    isLastPage: boolean;
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
};