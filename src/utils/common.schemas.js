/**
 * Common schemas that are used in multiple validators.
 * @file defines common schemas used in multiple validators
 * @module Common Validator
 * @category validators
 * @subcategory common
 */

const commonSchemas = {
    errorResponse: {
        400: {
            type: 'object',
            additionalProperties: true
        },
        401: {
            type: 'object',
            additionalProperties: true
        },
        403: {
            type: 'object',
            additionalProperties: true
        },
        404: {
            type: 'object',
            additionalProperties: true
        },
        500: {
            type: 'object',
            additionalProperties: true
        },
        409: {
            type: 'object',
            additionalProperties: true
        },
        429: {
            type: 'object',
            additionalProperties: true
        },
    },
};

export default commonSchemas;