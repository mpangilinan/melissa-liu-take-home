import '@testing-library/jest-dom';
import {describe, expect, test} from '@jest/globals';
import {extendContactData, fetchPayById, filterByAmount, filterAllPays } from '../data';
import { createContactFixture, createPayFixture } from '../testutils';

jest.mock('../data', () => {
    const actual = jest.requireActual('../data');
    return {
      ...actual,
      fetchPayById: jest.fn(),
    };
  });

describe('data tests',  () => {
    describe('fetchPayById', () => {
        test('fetchPayById returns pay', async () => {
            const fixture = { 
                id: '123', 
                senderId: 'sender 1', 
                recipientId: 'recipient 1', 
                amount: '1000', 
                date: '2025-05-01', 
                status: 'paid' 
            };

            (fetchPayById as jest.Mock).mockResolvedValue(fixture);
            const res = await fetchPayById('123');
            expect(res).toEqual(fixture);
        });

        test('fetchPayById returns no pay', async () => {
            (fetchPayById as jest.Mock).mockResolvedValue(undefined);
            const res = await fetchPayById('789');
            expect(res).toBeUndefined();
        });
    });

    describe('extendContactData', () => {
        const contact1 = createContactFixture({name: 'melissa'});
        const contact2 = createContactFixture({name: 'lee'});
        const pays = [
            createPayFixture({
                status: 'paid', 
                sender: contact1, 
                recipient: contact2
            }),
            createPayFixture({
                status: 'pending', 
                sender: contact2, 
                recipient: contact1
            })
        ];
        const contacts = [contact1, contact2];
        
        test('extendContactData returns pending and paid counts', async () => {
            const expected = [
                {
                    ...contact1, 
                    total_pays: 2, 
                    total_pending: 1, 
                    total_paid: 1
                }, 
                {
                    ...contact2, 
                    total_pays: 2, 
                    total_pending: 1, 
                    total_paid: 1,
                }
            ];
            const res = extendContactData(pays, contacts);
            expect(res).toEqual(expected);
        });

    });

    describe('filterByAmount', () => {
        test('filterByAmount returns true', () => {
            expect(filterByAmount(598301, '$5,983.01')).toBe(true);
        });

        test('filterByAmount returns false', () => {
            expect(filterByAmount(598301, '$5983')).toBe(false);
        });
    });

    describe('filterAllPays', () => {
        const contact = createContactFixture({name: 'fetch name'});
        const pays = [
            createPayFixture({memo: 'fetch query'}),
            createPayFixture({sender: contact}),
            createPayFixture({memo: 'different memo'}),
        ];
        test('filterAllPays returns pay that match criteria', () => {
            expect(filterAllPays(pays, 'fetch')).toHaveLength(2);
        });

        test('filterAllPays returns 0 pays when query yields no results', () => {
            expect(filterAllPays(pays, 'brand new query')).toEqual([]);
        });

        test('filterAllPays returns all pays when query is empty', () => {
            expect(filterAllPays(pays, '')).toEqual(pays);
        });
    });
});