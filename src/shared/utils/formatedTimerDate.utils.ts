
export const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("pt-BR").format(date);
