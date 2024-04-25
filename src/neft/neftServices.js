 async function neftTransfer(){

    const requestBody = {
      "transfer": {
        "version": "1",
        "uniqueRequestNo": "7866646464",
        "appID": "265398",
        "customerID": "265765",
        "debitAccountNo": "000183200000042",
        "beneficiary": {
          "beneficiaryDetail": {
            "beneficiaryName": {
              "fullName": "AJAY RANA"
            },
            "beneficiaryAddress": {
              "address1": "Willston Road",
              "postalCode": "123659",
              "city": "Mumbai",
              "country": "IN"
            },
            "beneficiaryContact": {
              "mobileNo": "9561234523",
              "emailID": "Gourav Darjee@qualitykiosk.com"
            },
            "beneficiaryAccountNo": "50100002965304",
            "beneficiaryIFSC": "HDFC0001626",
            "beneficiaryMobileNo": "9869581569",
            "beneficiaryMMID": "9532870"
          }
        },
        "transferType": "NEFT",
        "transferCurrencyCode": "INR",
        "transferAmount": "20",
        "remitterToBeneficiaryInfo": "FUND TRANSFER"
      }
    };
    
    fetch(process.env.NEFT_TEST_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
      .then(response => {
        console.log(response)
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Success:', data);
        // Handle the response data here
      })
      .catch(error => {
        console.error('Error:', error);
        // Handle errors here
      });
    
      
}

export default {
    neftTransfer
  };