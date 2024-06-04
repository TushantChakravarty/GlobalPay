import axios from "axios";


export const createUPICollectRequest = async () => {
    const accountId = 'va_bsHcuO3YZ6y0IW4gA4KZXO63K';
    const accessKey = 'ak_test_xXSvqD0Zr3rMFL6KR8vfAClwnP7FtHO2FvLx';

    const secretKey = 'sk_test_hRUubmVpN6NGJs7kBWmAMQO3tqcW1YXATLUL';
    const url = `https://api.zwitch.io/v1/accounts/${accountId}/payments/upi/collect`;

    const data = {
        amount: 1000, // amount in the smallest currency unit (e.g., paise for INR)
        remitter_vpa_handle: '9340079982@paytm', // UPI ID of the customer
        expiry_in_minutes: 15, // expiry time for the payment request
        remark:'test',
        merchant_reference_id:"123456765432",
        metadata: {
            order_id: 'ORD123456',
            customer_id: 'CUST7890'
        }
      };

    try {
        const response = await axios.post(url, data, {
            headers: {
                'Authorization': `Bearer ${accessKey}:${secretKey}`,
                'Content-Type': 'application/json'
            }
        });
        console.log(response.data);
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
    }
};

export const createUPIVirtualAccount = async () => {
    const accountId = 'va_SMc6Bu2kux1TVZT5AdT3vonRc';
    const accessKey = 'ak_test_xXSvqD0Zr3rMFL6KR8vfAClwnP7FtHO2FvLx';

    const secretKey = 'sk_test_hRUubmVpN6NGJs7kBWmAMQO3tqcW1YXATLUL';
    const url = `https://api.zwitch.io/v1/accounts`;

    const data = {
        type:'virtual', // amount in the smallest currency unit (e.g., paise for INR)
        used_as:"wallet",
       name:"tushant chakravarty",
       mobile_number:"9340079982",
       email:"tushant029@gmail.com",
      };

    try {
        const response = await axios.post(url, data, {
            headers: {
                'Authorization': `Bearer ${accessKey}:${secretKey}`,
                'Content-Type': 'application/json'
            }
        });
        console.log(response.data);
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
    }
};

export const updateUPIVirtualAccount = async () => {
    const accountId = 'va_SMc6Bu2kux1TVZT5AdT3vonRc';
    const accessKey = 'ak_test_xXSvqD0Zr3rMFL6KR8vfAClwnP7FtHO2FvLx';

    const secretKey = 'sk_test_hRUubmVpN6NGJs7kBWmAMQO3tqcW1YXATLUL';
    const url = `https://api.zwitch.io/v1/accounts/${accountId}`;

    const data = {
       create_vpa:true
      };

    try {
        const response = await axios.post(url, data, {
            headers: {
                'Authorization': `Bearer ${accessKey}:${secretKey}`,
                'Content-Type': 'application/json'
            }
        });
        console.log(response.data);
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
    }
};

//createUPICollectRequest();
