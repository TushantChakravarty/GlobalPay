
import fetch from "node-fetch"
export async function bulkpeUpiCollect(){
  const url = 'https://xapi.bulkpe.in/client/pg1Upicollect';
  console.log("coming to this file")
  const data = {
    amount: 10,
    redirectUrl: 'https://google.com',
    referenceId: 'TESTTRX011',
    note: 'Test',
    vpa: '8318089088@ybl'
  };
  //console.log("checkpoint 2",process.env.BULKPE_API_KEY)

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.BULKPE_API_KEY}`
  };

  console.log("checkpoint 3")
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    });

    console.log("checkpoint 4")
    const responseData = await response.json();
    console.log("checkpoint 5")
    console.log('Response:', responseData);
    return responseData;
  }catch (error) {
      console.error('Bulkpe upi collect:', error);
    }
}