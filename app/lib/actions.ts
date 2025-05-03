'use server';

import { z } from 'zod';
import { user } from './placeholder-data';
import { Pay } from './definitions';
import { v4 as uuidv4 } from 'uuid';
import { fetchContacts, pays } from './data';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
    id: z.string(),
    contactId: z.string(),
    amount: z.coerce.number(),
    date: z.string(),
    memo: z.string().max(64),
    payType: z.enum(['request', 'pay']),
});

const CreatePay = FormSchema.omit({ id: true });
export async function createPay(formData: FormData) {
    const contacts = await fetchContacts();
    const { contactId, amount, payType, memo, date,  } = CreatePay.parse({
        contactId: formData.get('contactId'),
        amount: formData.get('amount'),
        memo: formData.get('memo'),
        date: formData.get('date'),
        payType: formData.get('payType')
    });
    const amountInCents = amount * 100;
    const status = await calculateStatus(payType, new Date(date));

    const p: Pay = {
        id: uuidv4(),
        amount: amountInCents,
        status,
        date,
        sender: user,
        recipient: user,
        memo: memo,
    };

    const contact = contacts.filter((c) => c.id === contactId)[0];
    status === 'paid' ? p.recipient = contact : p.sender = contact;

    pays.unshift(p);
    return redirect('/dashboard/pays');
}

export async function calculateStatus(payType: 'request' | 'pay', date: Date): Promise<'pending' | 'paid'> {
    if (payType === 'request') { 
        return 'pending'; 
    } else {
        const today = new Date();
        const isDateInFuture = date > today;
        return isDateInFuture ? 'pending' : 'paid';
    }
}