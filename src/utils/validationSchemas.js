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

  export const payinPageSchema ={
    body: {
        type: 'object',
        required: ['amount','customer_emailId','customer_phone','customer_address','customer_name','transaction_id'],
        properties: {
            amount: { type: 'number', minimum: 0.01 },
            customer_emailId: { type: 'string', format: 'email' },
            customer_phone: { type: 'string' },
            customer_address: { type: 'string' },
            customer_name: { type: 'string' },
            transaction_id: { type: 'string' }
        }
    }
}