import React, { useState } from "react";
import Device from "../components/Device";
import { getSubscription } from "../api/api";


function Home() {
    const [number, setNumber] = useState('');
    // const getSubscription = () => {
    //     console.log('getSub')
    // }
    if(number.length === 10 || number.length === 15) {
        getSubscription(number)
    }
    return (
        <div>
            <h2>Provide the Subscription or Serial Number or NSC ID</h2>
            <input type='number' value={number} onChange={(e) => setNumber(e.target.value)}/>
            <ul>
                <Device />
            </ul>
        </div>
    )
}

export default Home;