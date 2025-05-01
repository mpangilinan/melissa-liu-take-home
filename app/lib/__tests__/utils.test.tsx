import '@testing-library/jest-dom';
import {describe, expect, test} from '@jest/globals';
import { createRandomPays} from '../utils';

jest.mock('../placeholder-data', () => ({
    contacts: [
        {
            id: '123', 
            name: 'Test Contact 1', 
            email: 'testcontact@email.com', 
            image_url: '../../../public/contacts/amy-burns.png'
        },
        {
            id: '456', 
            name: 'Test Contact 2', 
            email: 'testcontact@email.com', 
            image_url: '../../../public/contacts/amy-burns.png'
        },
        {
            id: '789', 
            name: 'Test Contact 3', 
            email: 'testcontact@email.com', 
            image_url: '../../../public/contacts/amy-burns.png'
        }
    ],
}));

describe('utils tests',  () => {
    test('createRandomPays returns default pays',  () => {
        const res =  createRandomPays({});
        
        expect(res.length).toBe(5);
        expect(res.every(pay => pay.recipient !== pay.sender)).toBe(true);
        expect(res.every(pay => pay.amount < 250000)).toBe(true);
        expect(res.every(pay => {
            const startDate = new Date('2024-06-01');
            const payDate = new Date(pay.date);
            return startDate < payDate;
        })).toBe(true)
        expect(res.every(pay => {
            const endDate = new Date('2025-05-31');
            const payDate = new Date(pay.date);
            return endDate > payDate;
        })).toBe(true)
    });

    test('createRandomPays returns specific pays',  () => {
        const Contact1 = {
            id: '123', 
            name: 'Test Contact', 
            email: 'testcontact@email.com', 
            image_url: '../../../public/contacts/amy-burns.png'
        };
        const req = {
            totalPays: 2,
            sender: Contact1, 
            maxPayAmount: 1500,
            start: '2025-04-01'}
        const res =  createRandomPays(req);
        
        expect(res.length).toBe(2);
        expect(res.every(pay => pay.recipient !== Contact1)).toBe(true);
        expect(res.every(pay => pay.amount < 1500)).toBe(true);
        expect(res.every(pay => {
            const startDate = new Date(req.start);
            const payDate = new Date(pay.date);
            return startDate < payDate;
        })).toBe(true)
    });
});