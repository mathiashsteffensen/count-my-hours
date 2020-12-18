import React from 'react'

import popUp from '../../popups/PopUp'

export default function WorkListing({workHours, refresh}) 
{
    let startTime = workHours.startTime.slice(11, 16)
    let endTime = workHours.endTime.slice(11, 16)

    let deleteShift = () =>
    {
        fetch((process.env.NODE_ENV === 'production' ? '' : 'http://localhost:4000') + '/shifts/', {
            method: 'DELETE',
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                shiftID: workHours._id
            })
        }).then((res) =>
        {
            if (res.status === 200) refresh()
        })
    }

    let handleRemoveForm = () =>
    {
        popUp(false)
        refresh()
    }

    let handleUpdateShiftForm = (e) =>
    {
        e.stopPropagation()
        popUp(true, 'update-shift', handleRemoveForm, {workHours: workHours})
    }

    return (
        <div className="py-2 lg:p-y0 flex flex-1 justify-between items-center w-11/12 bg-primary mb-2 px-4 rounded-lg shadow-lg">
            <p className="m-0 lg:w-3/5">{startTime} - {endTime}</p>
            <div className=" lg:w-2/5 flex justify-evenly items-center">
                <button onClick={deleteShift} className="hover:opacity-75 outline-none w-6 mx-1 lg:my-1"><img src="x-in-circle-red.svg" alt="delete shift"/></button>
                <button onClick={handleUpdateShiftForm} className="hover:opacity-75 outline-none w-6 lg:my-1"><img src="edit.svg" alt="edit shift"/></button>
            </div>
        </div>
    )
}
