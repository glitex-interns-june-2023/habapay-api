const paginator = (data, page, perPage) => {
  const offset = (page - 1) * perPage;

  const paginatedData = {
    page: page,
    total: data.count,
    perPage: perPage,
    previousPage: null,
    nextPage: null,
    lastPage: Math.ceil(data.count / perPage),
    data: data.rows,
  };

  if (offset > 0) {
    paginatedData.previousPage = page - 1;
  }
  if (offset + perPage < data.count) {
    paginatedData.nextPage = page + 1;
  }

  return paginatedData;
};


module.exports = paginator;
