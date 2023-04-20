export const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);

  return `${year}-${month}-${day}`;
};

export const getDefaultDates = (startDate?: Date, endDate?: Date) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const baseDateString = `${year}-${month}-01`;
  const defaultEndDate = new Date(baseDateString);
  const defaultDate = new Date(baseDateString);
  const defaultStartDate = new Date(
    defaultDate.setMonth(defaultDate.getMonth() - 3),
  );

  return [startDate || defaultStartDate, endDate || defaultEndDate];
};
