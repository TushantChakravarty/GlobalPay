import fetch from 'node-fetch'


export async function createZwitchPayoutService(details, type) {
    try {


    } catch (error) {

    }
}


export async function createBankAccountBeneificiary(details) {
    try {
        const { email = null, phone = null, account_number, ifsc_code } = details
        let data = { type: "account_number" }
        if (email !== null) {
            data.email = email
        }
        if (phone !== null) {
            data.phone = phone
        }
        const url = 'https://api.zwitch.io/v1/accounts/account_id/beneficiaries';
        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                Authorization: 'Bearer ak_test_xXSvqD0Zr3rMFL6KR8vfAClwnP7FtHO2FvLx:sk_test_hRUubmVpN6NGJs7kBWmAMQO3tqcW1YXATLUL'
            },
            body: JSON.stringify({ type: 'account_number' })
        };

        const res = await fetch(url, options);
        if (!res.ok) {
            console.log(await response.json())
            throw new Error('Network response was not ok');
        }
        const response_data = await res.json();
        console.log(json);


    } catch (error) {

    }
}