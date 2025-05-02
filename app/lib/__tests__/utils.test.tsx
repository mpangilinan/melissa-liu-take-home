import '@testing-library/jest-dom';
import {describe, expect, test} from '@jest/globals';
import { createRandomPays, groupPaysAmountsByMonth} from '../utils';
import { createContactFixture, createPayFixture } from '../testutils';

describe('utils tests',  () => {
    const contactMelissa = createContactFixture({name: 'melissa'})
    const contacts = [
        contactMelissa,
        createContactFixture({id: '456', name: 'Test Contact 2'}), 
        createContactFixture({id: '789', name: 'Test Contact 3'})
    ]

    test('createRandomPays returns default pays',  () => {
        const res =  createRandomPays({contacts});
        
        expect(res.length).toBe(10);
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
        const req = {
            contacts,
            totalPays: 2,
            sender: contactMelissa, 
            maxPayAmount: 1500,
            start: '2025-04-01'}
        const res = createRandomPays(req);
        
        expect(res.length).toBe(2);
        expect(res.every(pay => pay.recipient !== contactMelissa)).toBe(true);
        expect(res.every(pay => pay.amount < 1500)).toBe(true);
        expect(res.every(pay => {
            const startDate = new Date(req.start);
            const payDate = new Date(pay.date);
            return startDate < payDate;
        })).toBe(true)
    });

    test('groupPaysAmountsByMonth', () => {
        const janPay = createPayFixture({date: '2025-01-10', amount: 1100})
        const janPay2 = createPayFixture({date: '2025-01-13', amount: 1100})
        const febPay = createPayFixture({date: '2025-02-05', amount: 3300})
        const aprPay = createPayFixture({date: '2025-04-14', amount: 1200})
        const aprPay2 = createPayFixture({date: '2025-04-15', amount: 1100})
        const pays = [janPay, janPay2, febPay, aprPay, aprPay2];

        const res = groupPaysAmountsByMonth(pays)

        expect(res).toEqual([
            {month: 'Jun', activity: 0},
            {month: 'Jul', activity: 0},
            {month: 'Aug', activity: 0},
            {month: 'Sep', activity: 0},
            {month: 'Oct', activity: 0},
            {month: 'Nov', activity: 0},
            {month: 'Dec', activity: 0},
            {month: 'Jan', activity: 22},
            {month: 'Feb', activity: 33},
            {month: 'Mar', activity: 0},
            {month: 'Apr', activity: 23},
            {month: 'May', activity: 0},
        ])
    })
});