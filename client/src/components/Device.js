import DeviceProduct from './DeviceProduct';
import { useRequest } from '../hooks/use-request';
import { useState } from 'react';


function Device({deviceInfo: {subnum, serial, networkDeviceId, domainPackages, smsDeviceId, smsDomainId}}) {
    const {doRequest, errors, setErrors} = useRequest();
    const [successMessage, setSuccessMessage] = useState(null);

    const requestHandler = async (method,  urlEnding) => {
        setErrors(null)
        if (!serial && !smsDeviceId) {
            return setErrors('Message can not be send, Serial Number is missing!')
        }

        if(!window.confirm(`Do you want to send ${urlEnding} command?`)) {
            return;
        }

        const res = await doRequest(method, {smsDeviceId, serialNumber: serial}, urlEnding);
        if (res) {
            setSuccessMessage('Trigger was successfully sent!')
            setTimeout(() => {
                setSuccessMessage(null)
            }, 7000)
        }
    }

    return(
        <li>
            {
                successMessage && <div className='successMessage'>
                        <h5>
                            {successMessage}
                        </h5>
                    </div>
            }
            <div>
                <p><strong>Subscription:</strong> {subnum}</p>
                <p><strong>Serial Number:</strong> {serial}</p>
                <p><strong>Network Device ID:</strong> {networkDeviceId}</p>
                <p><strong>Sms Device ID:</strong> {smsDeviceId}</p>
                <p><strong>Sms Domen ID:</strong> {smsDomainId}</p> 
            </div>
            <div>
                <h3>Entitlements:</h3>
                {
                    domainPackages.map(domainPackage => {
                        return <DeviceProduct domainPackage={domainPackage} key={domainPackage.smsEntitlementId} />
                    })
                }
                
            </div>
            <div>
                {
                    errors != null && <p>{errors}</p>
                }
            </div>
            <div>
                {/* <button onClick={() => >Send Bouquet</button> */}
                <button onClick={() => requestHandler('post', 'fta')}>FTA Open Trigger</button>
                <button onClick={() => requestHandler('post', 'password')}>Reset Password</button>
                <button onClick={() => requestHandler('post', 'upgrade')}>Force Upgrade</button>
            </div>
            
        </li>
    )
}

export default Device;