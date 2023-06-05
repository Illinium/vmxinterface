const express = require ('express');
const app = express();
const axios = require ('axios');
const xml = require('xml-js');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

let sessionKey = null;

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
        const json = await JSON.parse(xml.xml2json(resp.data, { spaces: 2, compact: true }));
        sessionKey = json['soapenv:Envelope']['soapenv:Body']['ns2:signOnResponse'].sessionHandle['ns1:handle']._text;
        console.log(sessionKey)
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
                    <omit:handle>${sessionKey}</omit:handle>
                </sessionHandle>
            </omi:getUser>
        </soapenv:Body>
        </soapenv:Envelope>
        `
    if(!sessionKey) {
        connectToVMX();
        console.log('Connected to VMX from HOLD Session!')
    }
    try {
        await axios.post('https://10.103.2.18:8090/services/AdminMgmtService', holdXML, {
            headers: {
                'Content-type': 'text/xml'
            }
        });
        console.log('Hold response:' + sessionKey)
    } catch (err) {
        console.log(err)
    }
}, 360000)

app.listen(3000, () => {
    console.log('Server is running on port 3000!')
    connectToVMX();
});

// export {app};