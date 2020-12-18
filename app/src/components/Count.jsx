import React from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc)

export default function Count({shifts, user}) 
{
    let getTotalTimeWorked = () =>
    {
        let total = 0
        shifts.forEach((shift) =>
        {
            let start = dayjs.utc(shift.startTime)
            let end = dayjs.utc(shift.endTime)
            let shiftLength = end.diff(start) / 1000 / 60 / 60
            total += shiftLength
        })
        return total.toFixed(2)
    }

    let data = {
        numberOfShifts: shifts.length,
        totalTimeWorked: getTotalTimeWorked(),
    }

    data.averageShiftLength = (data.totalTimeWorked/data.numberOfShifts).toFixed(2)

    if (user)
    {
        data.totalEarned = data.totalTimeWorked * user.hourlySalary
    }

    return (
        <div className="flex justify-center items-center flex-col text-center bg-accent p-4 rounded-md shadow-lg">
            <p className="text-md font-medium text-primary my-1">{data.numberOfShifts} shifts in period.</p>
            <p className="text-md font-medium text-primary my-1">An average shift length of {isNaN(Number(data.averageShiftLength)) ? 0 : Number(data.averageShiftLength)} hours for a total of {Number(data.totalTimeWorked)} hours.</p>
            {user ? <p className="text-md font-medium text-primary my-1">With an hourly salary of {user.hourlySalary} that is {data.totalEarned} earned during the period.</p> : null}
            {user ? <p className="text-xs text-primary my-1">*You can change you hourly salary in your settings</p> : null}
        </div>
    )
}
