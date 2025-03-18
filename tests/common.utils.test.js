const { isValidEmail, respondSuccess, respondError, checkValidation } = require('../utils/common.utils');

describe('common.utils', () => {
    describe('isValidEmail', () => {
        it('should return true for valid email', () => {
            const email = 'test@example.com';
            expect(isValidEmail(email)).toBe(true);
        });

        it('should return false for invalid email', () => {
            const email = 'invalid-email';
            expect(isValidEmail(email)).toBe(false);
        });
    });

    describe('respondSuccess', () => {
        it('should return a success response object', () => {
            const data = { message: 'Success' };
            const response = respondSuccess(data);
            expect(response).toEqual({ status: 200, data });
        });
    });

    describe('respondError', () => {
        it('should return an error response object', () => {
            const error = { message: 'Error' };
            const response = respondError(error);
            expect(response).toEqual({ status: 500, error });
        });
    });

    describe('checkValidation', () => {
        it('should return true for valid data', () => {
            const data = { name: 'John Doe', email: 'john@example.com' };
            expect(checkValidation(data)).toBe(true);
        });

        it('should return false for invalid data', () => {
            const data = { name: 'John Doe' };
            expect(checkValidation(data)).toBe(false);
        });
    });
});