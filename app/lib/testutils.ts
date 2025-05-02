import { Contact, Pay } from './definitions';

type ContactProps = {
    id?: string;
    name?: string; 
    email?: string;
    image_url?: string;
}

export const createContactFixture = ({id, name, email, image_url}: ContactProps) : Contact => {
    return {
        id: id || '123', 
        name: name || 'Test Contact', 
        email: email || 'testcontact@email.com', 
        image_url: image_url || '../../../public/contacts/amy-burns.png'
    };
};

type PayProps = {
    id?: string; 
    sender?: Contact;
    recipient?: Contact; 
    amount?: number;
    date?: string;
    status?: 'pending' | 'paid', 
    memo?: string;
}

export const createPayFixture = ({id, sender, recipient, amount, date, status, memo}: PayProps) : Pay => {
    return {
        id: id  || 'b8aebb1b-57c5-424c-aedd-d532241f4f21', 
        sender: sender || createContactFixture({}), 
        recipient: recipient || createContactFixture({name: 'Test Recipient'}), 
        amount: amount || 10000,
        date: date || '2025-04-30',
        status: status || 'paid',
        memo: memo || 'test fixture'
    };
};