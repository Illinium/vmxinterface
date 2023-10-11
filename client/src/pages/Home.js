import React, { useEffect, useState } from "react";
import Device from "../components/Device";
import {useRequest}  from "../hooks/use-request";

import './Home.css'


function Home() {
    const [number, setNumber] = useState('');
    const [fetchedData, setFetchedData] = useState(null);
    const {doRequest, errors} = useRequest ();

    useEffect(() => {
        if(number.trim().length === 10 || number.trim().length === 15) {
            doRequest('get', {}, number).then(data => {
                setFetchedData(data)
            })
        } else {
            setFetchedData(null)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [number])

    if (errors) {
        console.log(errors)
        return <>
            <h1>Something went wrong!</h1>
        </>
    }
    return (
        <>
            <div className="searchBar">
                <label htmlFor="serialInput">Provide the Subscription or Serial Number or NSC ID</label>
                <input id="serialInput" type='number' value={number} onChange={(e) => setNumber(e.target.value)}/>
            </div>
            {
                fetchedData === null ? <h4>If you want to see a subscription drtails, provide please Box serial number or device number or subscription number!</h4> : 
                <ul>
                    {
                        fetchedData.map(deviceInfo => {
                            return <Device deviceInfo = {deviceInfo} key={deviceInfo.serial}/>
                        })
                    }
                </ul>
            }
        </>
    )
}

export default Home;