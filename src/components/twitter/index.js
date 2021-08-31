
import React, { useState, useEffect } from 'react';
// import getTwitterRules from "./getTwitterRules";


export default () => {

    const [rules, setRules] = useState([]);

    useEffect(() => {
        // Update the document title using the browser API
        // getTwitterRules().then((rules) => {
        //     console.log(rules)
        //     setRules(rules)
        // })
    });

    return (
        <div>Twitter settings
            <div>{rules}</div>
        </div>
    )
}