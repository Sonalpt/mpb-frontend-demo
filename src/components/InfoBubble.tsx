import React from 'react';

const InfoBubble = () => {
    return (
        <div className='infoBubble'>
            <h3>Useful Information</h3>
            <h4>For the period:</h4>
            <p>To properly fill in the "Period from" field, here is a schema and an example:</p>
            <p>Schema: "dd/mm/yy to dd/mm/yy"</p>
            <p>Example: "23/01/23 to 29/01/23"</p>
            <h4>For the schedules:</h4>
            <p>If empty: <br />
                Leave it blank
            </p>
            <p>If employee present:
                Schema per time slot: <br /><br /> "HH:mm - HH:mm" <br /> <br />
                Example for an employee, on Monday, starting in the morning, first time slot before the break: <br /> <br /> "08:00 - 13:00" <br /> <br />
                Example for the same employee, on Monday, after the break, second time slot of the day: <br /><br /> "13:30 - 17:00"
            </p>
        </div>
    );
};

export default InfoBubble;