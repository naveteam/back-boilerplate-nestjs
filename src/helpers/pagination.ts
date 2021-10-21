interface ParamsGetPagination {
  page: number;
  pageSize: number;
}

interface ReturnGetPagination {
  page: number;
  pageSize: number;
  originalPage: number;
  calculatePageCount: any;
}

export const getPagination = ({
  page = 1,
  pageSize = 10,
}: ParamsGetPagination): ReturnGetPagination => ({
  originalPage: Number(page),
  page: page === 1 ? 0 : pageSize * (page - 1),
  pageSize,
  calculatePageCount: (total: number): number => Math.ceil(total / pageSize),
});
