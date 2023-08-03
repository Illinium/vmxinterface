import { getTimestamp } from "./getTriggerTimestamp";


const generateXML = function(smsDeviceId: string, messageId: number, trigger: string, priority: number = 2, cycleDuration: number = 1200): string {
    if(!process.env.SESSION_HANDLE) {
        throw new Error('SESSION_HANDLE is missing!...')
    }
    let xml = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:omi="http://www.verimatrix.com/omi" xmlns:omit="http://www.verimatrix.com/schemas/OMItypes.xsd">
        <soapenv:Header/>
        <soapenv:Body>
        <omi:generateOSM>
            <messageEntity>
                <omit:entityType>DEVICE</omit:entityType>
                <omit:entityId>${smsDeviceId}</omit:entityId>
                <!--Optional:-->
                <omit:smsNetworkId>DVB-NETWORK</omit:smsNetworkId>
            </messageEntity>
            <message>
                <omit:messageHandle>
                    <!--Optional:-->
                    <omit:sector>232</omit:sector>
                    <omit:messageId>${messageId}</omit:messageId>
                </omit:messageHandle>
                <omit:messageAttributes>
                    <omit:contentMode>NEG</omit:contentMode>
                    <!--Optional:-->
                    <omit:priority>${priority}</omit:priority>
                    <!--Optional:-->
                    <omit:cycleDuration>${cycleDuration}</omit:cycleDuration>
                </omit:messageAttributes>
                <!--1 to 2 repetitions:-->
                <omit:messageText>
                    <omit:text>${trigger}</omit:text>
                </omit:messageText>
                <!--Optional:-->
                <omit:charsetName>UTF-8</omit:charsetName>
                <!--1 to 2 repetitions:-->
                <omit:messageDescriptor>
                    <omit:displayMode>RM_IMMED</omit:displayMode>
                    <omit:displayDuration>2</omit:displayDuration>
                    <omit:xOrigin>ORIGL</omit:xOrigin>
                    <omit:xPosition>0</omit:xPosition>
                    <omit:xAnchor>CENTER</omit:xAnchor>
                    <omit:yOrigin>ORIGTOP</omit:yOrigin>
                    <omit:yPosition>0</omit:yPosition>
                    <omit:yAnchor>CENTER</omit:yAnchor>
                    <omit:textAlign>LEFT</omit:textAlign>
                    <omit:bgColor>0</omit:bgColor>
                    <omit:alpha>0</omit:alpha>
                </omit:messageDescriptor>
            </message>
            <sessionHandle>
                <omit:handle>${process.env.SESSION_HANDLE}</omit:handle>
            </sessionHandle>
        </omi:generateOSM>
        </soapenv:Body>
        </soapenv:Envelope>
    `
    return xml;
}

export { generateXML };