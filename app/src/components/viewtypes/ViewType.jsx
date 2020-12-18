import React from 'react'

import Week from './week/Week'
import Month from './month/Month'
import PayPeriod from './payPeriod/PayPeriod'
import Settings from './settings/Settings'

export default function ViewType({viewtype, user, refreshUser}) 
{
    switch(viewtype)
    {
        case 'week':
            return <Week />
        case 'month':
            return <Month />
        case 'pay-period':
            return <PayPeriod user={user} />
        case 'settings':
            return <Settings refresh={refreshUser} user={user} />
        default:
    }
}
