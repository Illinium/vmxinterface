import express from "express";
import { json } from "body-parser";
import cors from 'cors'
import axios from "axios";
import { xml2json } from "xml-js";
import { getSubscriptionRouter } from "./routes/getSubscription";
import { errorHandler, NotFoundError } from "@atrex/common";
const app = express();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

app.set('trust proxy', true);
app.use(json());
app.use(cors());


const connectToVMX = async () => {
    let signOnXML = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:omi="http://www.verimatrix.com/omi" xmlns:omit="http://www.verimatrix.com/schemas/OMItypes.xsd">
        <soapenv:Header/>
        <soapenv:Body>
        <omi:signOn>
            <userAttributes>
                <omit:userName></omit:userName>
                <omit:password></omit:password>
                <!--Optional:-->
                <omit:newPassword>?</omit:newPassword>
            </userAttributes>
        </omi:signOn>
        </soapenv:Body>
        </soapenv:Envelope>
        `
    try {
        const resp = await axios.post('https://10.103.2.18:8090/services/AdminMgmtService', signOnXML, {
            headers: {
                'Content-type': 'text/xml'
            }
        })
        if(resp.status === 200) {
        const json = await JSON.parse(xml2json(resp.data, { spaces: 2, compact: true }));
        process.env['SESSION_HANDLE'] = json['soapenv:Envelope']['soapenv:Body']['ns2:signOnResponse'].sessionHandle['ns1:handle']._text;
        }
    } catch (err) {
        console.log(err)
    }
}

setInterval( async() => {
    let holdXML = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:omi="http://www.verimatrix.com/omi" xmlns:omit="http://www.verimatrix.com/schemas/OMItypes.xsd">
        <soapenv:Header/>
        <soapenv:Body>
            <omi:getUser>
                <userQuery>
                    <omit:userName>o.khodorko</omit:userName>
                </userQuery>
                <sessionHandle>
                    <omit:handle>${process.env.SESSION_HANDLE}</omit:handle>
                </sessionHandle>
            </omi:getUser>
        </soapenv:Body>
        </soapenv:Envelope>
        `
    if(!process.env.SESSION_HANDLE) {
        connectToVMX();
        console.log('Connected to VMX from HOLD Session!')
    }
    try {
        await axios.post('https://10.103.2.18:8090/services/AdminMgmtService', holdXML, {
            headers: {
                'Content-type': 'text/xml'
            }
        });
        // console.log('Hold response:' + process.env.SESSION_HANDLE)
    } catch (err) {
        console.log(err)
    }
}, 360000);

app.use(getSubscriptionRouter);

app.all('*', async () => { 
    throw new NotFoundError();
});

app.use(errorHandler);

app.listen(3000, () => {
    console.log('Server is running on port 3000!');
    connectToVMX();
});
