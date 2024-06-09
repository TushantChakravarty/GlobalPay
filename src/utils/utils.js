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
