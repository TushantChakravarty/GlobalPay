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
        required: ['amount','customer_emailId','customer_phone','customer_address','customer_name'],
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

export const bankSchema = {
  body: {
    type: 'object',
    required: ['name', 'email', 'phone', 'ifsc', 'bank_name', 'account_number'],
    properties: {
      name: {
        type: 'string',
        minLength: 1
      },
      email: {
        type: 'string',
        format: 'email'
      },
      phone: {
        type: 'string',
        pattern: '^[0-9]{10}$'
      },
      ifsc: {
        type: 'string',
        pattern: '^[A-Z]{4}0[A-Z0-9]{6}$'
      },
      bank_name: {
        type: 'string'
      },
      amount: { type: "number", minimum: 0.0 },
      account_number: {
        type: 'string',
        minLength: 9,
        maxLength: 18
      }
    }

  }

};
export const upiSchema = {
  body: {
    type: 'object',
    required: ['name', 'email', 'phone', 'upi', "amount"], // All fields are required
    properties: {
      name: { type: 'string', minLength: 1 }, // Name must be a non-empty string
      email: {
        type: 'string',
        format: 'email' // Validate as email
      },
      phone: {
        type: 'string',
        pattern: '^[0-9]{10}$' // Validate as a 10-digit phone number
      },
      amount: { type: "number", minimum: 0.0 },
      upi: {
        type: 'string',
        pattern: '^[a-zA-Z0-9.\\-_]{2,256}@[a-zA-Z]{2,64}$' // Validate as UPI ID pattern
      },
    },
  },

}
