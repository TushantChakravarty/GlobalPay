export function convertToIST(date) {
    // Create a new Date object using the UTC timestamp
    const utcDate = new Date(date);

    // Get the offset in milliseconds for IST (5 hours and 30 minutes ahead of UTC)
    const istOffset = 5.5 * 60 * 60 * 1000;

    // Adjust the UTC date by the IST offset
    const istDate = new Date(utcDate.getTime() + istOffset);

    return istDate?.toDateString;
}

export async function callbackPayin (details,url){
    const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin' : '*',
          'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS', 
                 },
        body: JSON.stringify(details)
      })
         .then(resp => resp.json())
         .then(json =>{
           //console.log(json)
           if(json)
           return json
          return false
          })
         .catch((error)=>{
          console.log(error)
         })
      return response
}
export async function fetchWithAuth(url, method, email_id, password,token) {
  //console.log(url)
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  //headers.append('Authorization', `Bearer ${token}`);

  const body = JSON.stringify({ email_id, password,token});

  const options = {
    method: method,
    headers: headers,
    body: body
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
     // throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('resp',data)
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}
