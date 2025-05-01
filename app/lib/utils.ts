import { Activity, Contact } from './definitions';
import {v4 as uuidv4} from 'uuid';
import { contacts } from './placeholder-data';

export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-US',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const generateYAxis = (activity: Activity[]) => {
  // Calculate what labels we need to display on the y-axis
  // based on highest record and in 1000s
  const yAxisLabels = [];
  const highestRecord = Math.max(...activity.map((month) => month.activity));
  const topLabel = Math.ceil(highestRecord / 1000) * 1000;

  for (let i = topLabel; i >= 0; i -= 1000) {
    yAxisLabels.push(`$${i / 1000}K`);
  }

  return { yAxisLabels, topLabel };
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};

const getRandomUserWithExclusion = (contacts: Contact[], excludeContact?: Contact): Contact => {
    const possibleContacts = contacts.filter((c) => c != excludeContact)
    const index = Math.floor(Math.random() * possibleContacts.length);
    return possibleContacts[index];
  };

const getRandomDate = (start: string, end: string): string => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
    const date = new Date(randomTime);
    return date.toISOString().split('T')[0]; // 'yyyy-mm-dd'
}

type CreateRandomPaysArgs = {
  totalPays?: number,
  sender?: Contact,
  recipient?: Contact,
  maxPayAmount?: number,
  start?: string,
  end?: string,
};

export const createRandomPays = ({
  totalPays=5,
  sender,
  recipient,
  maxPayAmount=250000,
  start='2024-06-01',
  end='2025-05-31'
}: CreateRandomPaysArgs): Pay[] => {

  const paySender = sender || getRandomUserWithExclusion(contacts);

  return Array.from({ length: totalPays }, (_, i) => ({
    id: uuidv4(),
    sender: paySender,
    recipient: recipient || getRandomUserWithExclusion(contacts, paySender),
    amount: Math.floor(Math.random() * maxPayAmount),
    date: getRandomDate(start, end),
    status: 'paid',
  }))
}