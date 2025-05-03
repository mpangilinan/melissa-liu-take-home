import { calculateStatus } from '../actions';

describe('actions tests', () => {
    describe('calculateStatus', () => {
        test('calculateStatus returns pending for requests', async () => {
            const today = new Date();
            expect(await calculateStatus('request',today)).toEqual('pending');
        });

        test('calculateStatus returns paid for today pays', async () => {
            const today = new Date();
            expect(await calculateStatus('pay',today)).toEqual('paid');
        });

        test('calculateStatus returns pending for future pays', async () => {
            const futureDate = new Date(2045, 4, 2);
            expect(await calculateStatus('pay',futureDate)).toEqual('pending');
        });

        
    });
});