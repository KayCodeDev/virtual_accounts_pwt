const SquadcoService = require('../services/squadco.service');

describe('SquadcoService', () => {
    describe('sendRequest', () => {
        it('should send a request to Squadco', async () => {
            const requestData = { customerIdentifier: 'CPL-PWT-44564323', firstName: 'Kenneth', lastName: 'Imadojemun' };
            const response = await SquadcoService.sendRequest(requestData);
            expect(response).toEqual({ status: 200, data: requestData });
        });
    });
});