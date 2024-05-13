const fetch = require("node-fetch")

export async function cashfreePayout(details) {
  try {
    const url = 'https://payout-gamma.cashfree.com/payout/v1/authorize'; // PLease change the user according to production -:https://payout-api.cashfree.com/payout/v1/authorize
    const authorization_options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'x-client-id': process.env.CF_CLIENT_ID,
        'x-client-secret': process.env.CF_CLIENT_SECRET
      }
    };
    const authorization_response = await fetch(url, authorization_options)
    if (!authorization_response.ok) {
      throw new Error(`HTTP error! Status: ${authorization_response.status}`);
    }
    const authorization_data = await authorization_response.json();
    console.log(authorization_data)

    const token = "Bearer " + authorization_data.data.token
    console.log("this is token", token)
    const referenceId = Math.floor(Math.random() * 10000000000000);
    const postData = {
      amount: details?.amount,  //Please paste here dynamic amount 
      transferId: referenceId, //please provide here dynamic transfer id and it will be always unique
      transferMode: "upi",  //please provide here the transfermode
      beneDetails: {
        name: details?.account_name,  // please provide here the beneficiary details correctly
        email: details?.customer_email,
        phone: details?.customer_phone,
        vpa: details?.customer_upiId, // vpa should always be in capital and according to user details make it dynamic
        address1: details?.customer_address //provide any related address
      }
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(postData)
    };


    const response = await fetch("https://payout-gamma.cashfree.com/payout/v1/directTransfer", options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log('POST request successful:', data);
   
  } catch (err) {
    console.log(err)
  }

}

export async function generateCashfreePayinOrder(details)
{
  const referenceId = Math.floor(Math.random() * 10000000000000);
  const customerReferenceId = Math.floor(Math.random() * 10000000000000);

  const data = {
    customer_details: {
      customer_id: `${customerReferenceId}`,
      customer_phone: `${details?.phone}`
    },
    order_meta: {
      return_url: 'https://example.com?order_id=playstation_purchase_4',
      payment_methods: 'cc,dc,upi'
    },
    order_id: `${referenceId}`,
    order_currency: 'INR',
    order_amount: details?.amount
  };
  
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'x-api-version': '2023-08-01',
    'x-client-id': process.env.CASHFREE_PAYINS_CLIENT_ID_PROD,
    'x-client-secret': process.env.CASHFREE_PAYINS_CLIENT_SECRET_PROD
  };
  
  const response = await fetch('https://api.cashfree.com/pg/orders', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data)
  })
  const responseJson = await response.json()
  return responseJson
}

export async function cashfreePayin( details)
{
  
 
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'x-api-version': '2023-08-01',
    'x-client-id': process.env.CASHFREE_PAYINS_CLIENT_ID_PROD,
    'x-client-secret': process.env.CASHFREE_PAYINS_CLIENT_SECRET_PROD
  };
  
  
  const responseJson = await generateCashfreePayinOrder(details)
  
  console.log(responseJson)
  const data = {
    payment_session_id: responseJson.payment_session_id,
    payment_method: {
      upi: { channel: 'link',
      upi_id:details?.upiId
    },

    },
   

  };
  
  
  const response = await fetch('https://api.cashfree.com/pg/orders/sessions', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data)
  })
  .then(response => {
    // console.log(response)
    // if (!response.ok) {
    //   throw new Error('Network response was not ok');
    // }
    return response.json();
  })
  .then(jsonResponse => {
    console.log('resp',jsonResponse);
    if(jsonResponse?.data?.payload?.default&&jsonResponse?.cf_payment_id)
    {
      return{
        code:200,
        urls:jsonResponse?.data?.payload,
        transactionId: jsonResponse?.cf_payment_id
      }
    } // Handle the response data
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });

   return response
 
}


export async function cashfreePayoutBank(details,dao,mapper,userData,usrConst,gateway) {
  try {
    const url = 'https://payout-gamma.cashfree.com/payout/v1/authorize'; // PLease change the user according to production -:https://payout-api.cashfree.com/payout/v1/authorize
    const authorization_options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'x-client-id': process.env.CF_CLIENT_ID,
        'x-client-secret': process.env.CF_CLIENT_SECRET
      }
    };
    const authorization_response = await fetch(url, authorization_options)
    if (!authorization_response.ok) {
      throw new Error(`HTTP error! Status: ${authorization_response.status}`);
    }
    const authorization_data = await authorization_response.json();
    console.log(authorization_data)

    const token = "Bearer " + authorization_data.data.token

    const postData = {
      amount: 1,  //Please paste here dynamic amount 
      transferId: 67896688989890, //please provide here dynamic transfer id and it will be always unique
      transferMode: "banktransfer",  //please provide here the transfermode
      beneDetails: {
        name: "Tushant chakravarty",  // please provide here the beneficiary details correctly
        email: "tushant029@gmail.com",
        phone: "+919340079982", // vpa should always be in capital and according to user details make it dynamic
        bankAccount: "026291800001191",
        address1: "Kasia kushinagar" //provide any related address
      }
    }
    const referenceId = Math.floor(Math.random() * 10000000000000);

    const postData2 = {
      amount: details?.amount,
      transferId: referenceId,
      transferMode: "imps",
      remarks: "test",
      beneDetails: {
        bankAccount: "00011020001772",
        ifsc: "HDFC0000001",
        name: "john doe",
        email: "test@gmail.com",
        phone: "9988775566",
        address1: "LKO",
        city: "LKO",
        state: "UP",
        pincode: "222160",
        beneId: "898989899899"
      }
     
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(postData2)
    };


    const response = await fetch("https://payout-gamma.cashfree.com/payout/v1/directTransfer", options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log('POST request successful:', data);
   

  } catch (err) {
    console.log(err)
  }

}

