import axios from "axios";
import express, {Request, Response} from "express";
import { generateXML } from "../common/generateXML";
import { getTimestamp } from "../common/getTriggerTimestamp";

const router = express.Router();

interface boxParams {
    smsDeviceId: string;
    serialNumber?: number;
}

// Gets information about box status, serial number, and subscriptions.
router.get('/api/info/:number',
    async (req: Request, res: Response) => {
        try {
            const subscriptionInfo = await axios.get(`https://10.20.38.103:1880/prod/esb_api/v1/get_vm_info?num=${req.params.number}`)
            if(subscriptionInfo) {
                res.status(200).send(subscriptionInfo.data);
            }
        } catch (err) {
            console.log(err)
            res.send(err)
        }
});

// Sends a message with FTA open trigger
router.post('/api/info/fta', async (req: Request, res: Response) => {
        const {smsDeviceId} = req.body as boxParams;
        try {
            const resp = await axios.post('https://10.103.2.18:8090/services/MessagingService', generateXML(smsDeviceId, 190, `\\0x06VF${getTimestamp()}01`), {
                headers: {
                    'Content-type': 'text/xml'
                }
            })
            if(resp) {
                res.status(200).send(resp.data);
            }
        } catch (err) {
            console.log(err)
            res.send(err)
        }
})

// Resets Stb password to default "0000"
router.post('/api/info/password', async (req: Request, res: Response) => {
    const {smsDeviceId} = req.body as boxParams;
    try {
        const resp = await axios.post('https://10.103.2.18:8090/services/MessagingService', generateXML(smsDeviceId, 191, "\\0x06P0000"), {
            headers: {
                'Content-type': 'text/xml'
            }
        })
        if(res) {
            console.log(resp.data);
            res.status(200).send(resp.data);
        }
        
    } catch (err) {
        res.send(err)
        console.log(err)
    }
})

// Sends a message with a force upgrade trigger, the trigger message is different for Strong and Scardin, so the logic checks the first 3-4 characters to send the right one.    
router.post('/api/info/upgrade', async (req: Request, res: Response) => {
    const {smsDeviceId, serial} = req.body;
    try {
        if(serial.toString().slice(0, 4) === '7600' || serial.toString().slice(0, 4) === '7602'){
            const resp = await axios.post('https://10.103.2.18:8090/services/MessagingService', generateXML(smsDeviceId, 192, "\\0x06UF00000000816078E7"), {
                headers: {
                    'Content-type': 'text/xml'
                }
            })
            if(res) {
                console.log(resp.data);
                res.status(200).send(resp.data);
            }
        }
        if(serial.toString().slice(0, 3) === '190') {
            const resp = await axios.post('https://10.103.2.18:8090/services/MessagingService', generateXML(smsDeviceId, 192, "\\0x06UF0000000085618020"), {
                headers: {
                    'Content-type': 'text/xml'
                }
            })
            if(res) {
                console.log(resp.data);
                res.status(200).send(resp.data);
            }
        }

        res.status(404).send('Number is incorrect!')
        
    } catch (err) {
        res.send(err)
        console.log(err)
    }
})



export {router as getSubscriptionRouter};