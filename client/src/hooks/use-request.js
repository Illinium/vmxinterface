import axios from 'axios';
import { useState } from 'react';

const url = 'http://vmxinterface.com/api/info/';

const useRequest = () => {
    const [errors, setErrors] = useState(null);
    const doRequest = async (method, body, urlEnding = '') => {
        try {
            setErrors(null)
            const res = await axios[method](`${url}${urlEnding}`, {...body})
            return res.data
        } catch (err) {
            setErrors(err)
        }
    }
    return { doRequest, errors, setErrors }
}

export {
    useRequest
}