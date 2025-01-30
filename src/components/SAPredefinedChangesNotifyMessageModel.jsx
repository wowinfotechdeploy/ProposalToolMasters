import React from 'react';
import { SAPredefinedChangesNotifyMessage } from './GlobalMessage'; // Ensure this is a valid import

const SANotifyMessage = ({ Params }) => {
    return (
        <div className='mb-2'>
            {Params !== undefined && Params.SAChanges && (
                <div className='col-12'>
                    <div className='SAPredefinedChangesNotifyMessage'>
                        <span>{SAPredefinedChangesNotifyMessage}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SANotifyMessage;
