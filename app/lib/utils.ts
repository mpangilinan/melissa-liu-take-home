import { Activity, Contact } from './definitions';
import {v4 as uuidv4} from 'uuid';

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
  contacts: Contact[],
  totalPays?: number,
  sender?: Contact,
  recipient?: Contact,
  maxPayAmount?: number,
  start?: string,
  end?: string,
  status?: 'paid' | 'pending',
};

export const createRandomPays = ({
  contacts,
  totalPays=10,
  sender,
  recipient,
  maxPayAmount=250000,
  start='2024-06-01',
  end='2025-05-31',
  status
}: CreateRandomPaysArgs): Pay[] => {

  return Array.from({ length: totalPays }, (_, i) => {

    const p = {
      id: uuidv4(),
      sender: sender ?? getRandomUserWithExclusion(contacts),
      recipient: recipient ?? getRandomUserWithExclusion(contacts, sender),
      amount: Math.floor(Math.random() * maxPayAmount),
      date: getRandomDate(start, end),
      status: status ?? Math.random() < 0.5 ? 'paid' : 'pending',
      };

    if (p.sender === p.recipient) {
      p.recipient = getRandomUserWithExclusion(contacts, p.sender);
    };

    return p
  })
}

// Assumes pays are from a single year, as stated in requirements. 
// Will break when pays span over May 2024 and May 2025.
export const groupPaysAmountsByMonth = (pays: Pay[]): Activity[] => {
  const activitiesMap = new Map<string, number>([
    ['Jun', 0],
    ['Jul', 0],
    ['Aug', 0],
    ['Sep', 0],
    ['Oct', 0],
    ['Nov', 0],
    ['Dec', 0],
    ['Jan', 0],
    ['Feb', 0],
    ['Mar', 0],
    ['Apr', 0],
    ['May', 0],
  ]);

  pays.forEach((pay) => {
    const payDate = new Date(pay.date);
    const monthAbbr = payDate.toLocaleString('en-US', { month: 'short' });
    activitiesMap.set(monthAbbr, activitiesMap.get(monthAbbr) + pay.amount)
  })

  const activities = Array.from(activitiesMap, ([month, activity]) => ({
    month,
    activity: Number(activity)/100,
  } as Activity));
  
  return activities
}