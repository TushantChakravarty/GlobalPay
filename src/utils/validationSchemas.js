export const loginSchema = {
    body: {
      type: 'object',
      required: ['email_id', 'password'],
      properties: {
        username: { type: 'string' },
        password: { type: 'string' }
      }
    }
  };

  export const adminLoginSchema = {
    body: {
      type: 'object',
      required: ['emailId', 'password'],
      properties: {
        username: { type: 'string' },
        password: { type: 'string' }
      }
    }
  };