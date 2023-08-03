import axios from 'axios';

// const url = 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local'; 
// const url = 'http://localhost'; 

const getSubscription = async (number) => {
    try {
        const res = await axios.get('http://localhost:3000/api/info', {number})
        console.log('client: ', res)
    } catch (err) {
        console.log(err)
    }
}

export {
    getSubscription
}