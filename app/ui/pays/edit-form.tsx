'use client';

import { ContactField, Pay, PayForm } from '@/app/lib/definitions';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  CalendarDaysIcon, 
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { editPay } from '@/app/lib/actions';
import { user } from '@/app/lib/placeholder-data';

export default function EditPayForm({pay}: {pay: Pay}) {
  if (!pay) return 'No pay available';
  
  const contact = ([pay.recipient, pay.sender]).filter(contact => contact.name !== user.name)[0];

  const today = new Date();
  today.setDate(today.getDate() + 30);
  const date30DaysFromNow = today.toISOString().split('T')[0];
  const payDate = new Date(pay.date);

  const formattedAmount = ( pay.amount / 100).toFixed(2);
  const shouldBeDisabled = pay.status === 'paid' && payDate < today;

  return (
    <form action={editPay}>
      <input type="hidden" name="id" value={pay.id} />
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Contact Name */}
        <div className="mb-4">
          <label htmlFor="contact" className="mb-2 block text-sm font-medium">
            Choose contact
          </label>
          <div className="relative">
          <select
              id="contact"
              name="contactId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={contact.name}
              disabled
            >
              <option key={contact.id} value={contact.id}>
                {contact.name}
              </option>
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Pay Amount */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Choose an amount
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                defaultValue={formattedAmount}
                required
                disabled={shouldBeDisabled}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Memo */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Memo (max 64 characters)
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="memo"
                name="memo"
                type="text"
                value={pay.memo}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <PencilSquareIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500"/>
            </div>
          </div>
        </div>

        {/* Date */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Date
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                type="date"
                id="date"
                name="date"
                defaultValue={pay.date}
                min={pay.date}
                max={date30DaysFromNow}
                disabled={shouldBeDisabled}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <CalendarDaysIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500"/>
            </div>
          </div>
        </div>

        {/* Pay Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Choose pay type
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="request"
                  name="payType"
                  type="radio"
                  value="request"
                  defaultChecked={pay.status === 'pending'}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Pending <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="pay"
                  name="payType"
                  type="radio"
                  value="pay"
                  defaultChecked={pay.status === 'paid'}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="pay"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Paid <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/pays"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit" >Edit Pay</Button>
      </div>
    </form>
  );
}
