

export function responseMapping(code, msg) {
    return {
        responseCode: code,
        responseMessage: msg
    }
}

export function responseMappingWithData(code, msg, data) {
    return {
        responseCode: code,
        responseMessage: msg,
        responseData: data
    }
}



