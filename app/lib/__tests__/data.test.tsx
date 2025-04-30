import '@testing-library/jest-dom';
import {describe, expect, test} from '@jest/globals';
import {fetchPayById } from '../data';

jest.mock('../placeholder-data', () => ({
    pays: [
    { id: '123', senderId: 'sender 1', recipientId: 'recipient 1', amount: '1000', date: '2025-05-01', status: 'paid' },
    { id: '456', senderId: 'sender 2', recipientId: 'recipient 2', amount: '2000', date: '2025-06-02', status: 'pending' },
    ],
}));

describe('data tests',  () => {
    test('fetchPayById returns pay', async () => {
        const res = await fetchPayById("123");
        const fixture = { 
            id: '123', 
            senderId: 'sender 1', 
            recipientId: 'recipient 1', 
            amount: '1000', 
            date: '2025-05-01', 
            status: 'paid' 
        };

        expect(res).toEqual(fixture)
    });

    test('fetchPayById returns no pay', async () => {
        const res = await fetchPayById("789");
    
        expect(res).toBeUndefined()
    });
});