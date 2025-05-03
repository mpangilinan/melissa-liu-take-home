import { useReducer } from 'react';
import {createRandomPays, formatCurrency, groupPaysAmountsByMonth} from './utils';
// import {contacts, pays, activity} from "@/app/lib/placeholder-data";
import {contacts} from './placeholder-data';
import { Contact } from './definitions';

export const pays = createRandomPays({contacts});

export async function fetchActivity() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    await new Promise((resolve) => setTimeout(resolve, getRandomMillis(3)));
    console.log('pays ', pays);

    return groupPaysAmountsByMonth(pays);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch activity data.');
  }
}

export async function fetchLatestPays() {
  try {
    await new Promise((resolve) => setTimeout(resolve, getRandomMillis(3)));

    // TODO: return latest pays data joined with contacts
    return [];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest pays.');
  }
}

export async function fetchCardData() {
  try {
    const payCountPromise = new Promise((resolve) => setTimeout(resolve, getRandomMillis(3)));
    const contactCountPromise = new Promise((resolve) => setTimeout(resolve, getRandomMillis(3)));
    const payStatusPromise = new Promise((resolve) => setTimeout(resolve, getRandomMillis(3)));

    const data = await Promise.all([
      payCountPromise,
      contactCountPromise,
      payStatusPromise,
    ]);

    // TODO: calculate these values
    const numberOfPays = pays.length;
    const numberOfContacts = contacts.length;
    const totalPaidPays = pays.filter(pay => pay.status === 'paid').length;
    const totalPendingPays = pays.filter(pay => pay.status === 'pending').length;

    return {
      numberOfContacts,
      numberOfPays,
      totalPaidPays,
      totalPendingPays,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

export function filterByAmount(amount: number, query?: string) {
  const match = query?.match(/[-+]?\d{1,3}(?:,\d{3})*(?:\.\d+)?|\d+(\.\d+)?/);
  const value = match ? parseFloat(match[0].replace(/,/g, '')) : NaN;
  return amount / 100 === value;
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredPays(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {

    // TODO: filter the related pay joined data for the query string passed
    const filteredPays = pays.filter((pay) => {
      const filteredByNumbers = filterByAmount(pay.amount, query);
      const filteredByString = pay.sender.name.includes((query.toLowerCase())) ||
        pay.sender.email.includes((query.toLowerCase())) ||
        pay.recipient.name.includes((query.toLowerCase())) ||
        pay.recipient.email.includes((query.toLowerCase())) ||
        pay.memo?.includes((query.toLowerCase()));
      const filteredByStatus = query === pay.status;
      
      return filteredByNumbers || filteredByString || filteredByStatus;
    });

    // sort by descending order
    filteredPays.sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date)));

    return filteredPays.slice(offset, offset + ITEMS_PER_PAGE);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch pays.');
  }
}

export async function fetchPaysPages(query: string) {
  try {
    // TODO: filter the related pay joined data for the query string passed to find this value
    return 0;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of pays.');
  }
}

export async function fetchPayById(id: string) {
  try {

    // TODO: return this pay
    return pays.find((pay) =>  pay.id === id);

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch pay.');
  }
}

export async function fetchContacts() {
  try {

    // TODO: return contacts
    return contacts;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all contacts.');
  }
}

type ExtendedContact = {
  total_pays: number,
  total_pending: number, 
  total_paid: number,
} & Contact;

export function extendContactData(pays: Pay[], contacts: Contact[]): ExtendedContact[] {
  const newContacts : ExtendedContact[] = [];

  contacts.forEach(contact => {
    const contactPays = pays.filter((pay)=> contact === pay.sender || contact === pay.recipient);
    let contactMap = {total_pays: 0, total_pending: 0, total_paid: 0};
    contactPays.forEach(pay => {
      if (pay.status === 'paid') { contactMap.total_paid += 1; }
      else if (pay.status === 'pending') { contactMap.total_pending += 1;}
      contactMap.total_pays += 1;
    });
    newContacts.push({...contact, ...contactMap});
  });
  return newContacts;
}

export async function fetchFilteredContacts(query: string) {
  try {
    // TODO: return contacts with total_pays, total_pending, total_paid
    const queriedContacts = contacts.filter((contact) => {
      return contact.name.includes((query.toLowerCase())) || contact.email.includes((query.toLocaleLowerCase()));
    });
    return extendContactData(pays, queriedContacts);
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch contact table.');
  }
}

function getRandomMillis(max) {
  return Math.random() * max * 1000;
}