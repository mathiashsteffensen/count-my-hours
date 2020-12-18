import React, { useState } from 'react'

import PayPeriodOptions from './PayPeriodOptions'

import popUp from '../../popups/PopUp'

export default function Settings({user, refresh}) 
 {
    // State for pay period configurations
    const [payPeriodType, setPayPeriodType] = useState(user.payPeriodType)
    const [hourlySalary, setHourlySalary] = useState(user.hourlySalary)

    const [startDate, setStartDate] = useState(user.payPeriodMonthly.startDate)

    const [startDay, setStartDay] = useState(payPeriodType === 'weekly' ? user.payPeriodWeekly.payPeriodDay : user.payPeriodBiWeekly.payPeriodDay)
    const [payOutDay, setPayOutDay] = useState(payPeriodType === 'weekly' ? user.payPeriodWeekly.payOutDay : user.payPeriodBiWeekly.payOutDay)
    
    const [payOutWeek, setPayOutWeek] = useState(user.payPeriodBiWeekly.payOutWeek)

    // Sets response for save attempt
    const [message, setMessage] = useState(null)

    // State for profile settings
    const [username, setUsername] = useState(user.username)

    // Used to determine if the request should verify password information before update, for password changes
    const [passwordChange, setPasswordChange] = useState(false)

    // State for password change
    const [oldPass, setOldPass] = useState("")
    const [newPass, setNewPass] = useState("")
    const [newPassAgain, setNewPassAgain] = useState("")

    let handleSave = (e) =>
    {
        e.preventDefault()
        let url;
        if (passwordChange && oldPass!=="" && newPass!=="" && newPassAgain!=="") url = (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:4000') + '/settings/save/change-password'
        else url = (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:4000') + '/settings/save'

        // Handles whether or not it should send a password object
        let passwordUpdates = {};

        if (passwordChange) 
        {
            passwordUpdates = {
                password: newPass
            }
        }

        // Handles what kind of pay period object to send since it depends on the type
        let payPeriodUpdates = {};

        switch(payPeriodType)
        {
            case "monthly":
                if (startDate < 1 || startDate > 28)
                {
                    return setMessage("startDate should be minimum 1 and maximum 28")
                }
                payPeriodUpdates = {
                    payPeriodMonthly: {
                        startDate: startDate,
                    }
                }
                break;
            case "biweekly":
                payPeriodUpdates = {
                    payPeriodBiWeekly: {
                        // Pay out on even or uneven weeks
                        payOutWeek: payOutWeek,
                        // Day of week money gets paid out
                        payOutDay: payOutDay,
                        // Day of week pay period starts and ends 14 days later [inclusive, ..., non-inclusive]
                        payPeriodDay: startDay
                    }
                }
                break;
            case "weekly":
                payPeriodUpdates = {
                    payPeriodWeekly: {
                        // Day of week money gets paid out
                        payOutDay: payOutDay,
                        // Day of week pay period starts and ends 14 days later [inclusive, ..., non-inclusive]
                        payPeriodDay: startDay
                    }
                }
                break;
            default:
        }

        if (newPass !== newPassAgain)
        {
            setMessage("Make sure you wrote the same new password twice")
        } else
        {
            fetch(url, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    updates: {
                        hourlySalary: hourlySalary,
                        payPeriodType: payPeriodType,
                        username: username,
                        ...payPeriodUpdates,
                        ...passwordUpdates
                    },
                    oldPassword: oldPass
                })
            })
            .then((res) =>
            {
                if (url.slice(-15) === "change-password")
                {
                    if (res.status === 200)
                    {
                        document.cookie = ""
                        window.location = (process.env.NODE_ENV === 'production' ? 'https://countmyhours.com' : 'http://localhost:4000') + '/login'
                    } else if (res.status === 400)
                    {
                        setMessage("Incorrect password")
                    } else
                    {
                        setMessage("An error occured when trying to change your password")
                    }
                } else
                {
                    refresh()
                    setMessage('Saved!')
                }
            })
        }
    }

    let removeForm = () =>
    {
        popUp(false)
    }

    let handleDeleteForm = () =>
    {
        popUp(true, 'delete-acc', removeForm, {})
    }

    return (
        <div className="flex justify-center items-center flex-col">
            <h2 className="w-4/5 text-primary font-semibold text-center">Settings</h2>
            <form className="w-10/12 flex justify-center items-center flex-col mt-2 bg-gray-200 rounded-md shadow-md p-4">
                <h3 className="text-xl">Pay Period Settings</h3>

                <label className="font-medium w-full flex items-center justify-between">
                    Hourly Salary:
                    <input onChange={(e) => setHourlySalary(e.target.value)} value={hourlySalary} className="text-sm w-2/5 ml-2 py-1 px-2 rounded shadow" type="number"/>
                </label>

                <label className="font-medium mt-2 w-full flex items-center justify-between">
                    Pay Period Type:
                    <select onChange={(e) => setPayPeriodType(e.target.value)} value={payPeriodType} className="text-sm w-2/5 ml-2 bg-white py-1 px-2 rounded shadow" type="number" name="pay-period" id="pay-period">
                        <option value="weekly">Weekly</option>
                        <option value="biweekly">Bi-Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </label>

                <PayPeriodOptions payPeriodType={payPeriodType} payOutDay={{value: payOutDay, update: setPayOutDay}} payOutWeek={{value: payOutWeek, update: setPayOutWeek}} startDay={{value: startDay, update: setStartDay}} startDate={{value: startDate, update: setStartDate}} />

                <h3 className="text-xl">Profile Settings</h3>

                <label className="font-medium w-full flex items-center justify-between mt-2">
                    Username:
                    <input onChange={(e) => setUsername(e.target.value)} value={username} className="text-sm w-2/5 ml-2 py-1 px-2 rounded shadow" type="text"/>
                </label>

                {
                passwordChange 
                ? 
                    <div className="mt-4 w-11/12 text-sm">
                        <label className="w-full flex items-center justify-between mt-2">
                            Old Password:
                            <input onChange={(e) => setOldPass(e.target.value)} value={oldPass} className="text-sm w-1/2 ml-2 py-1 px-2 rounded shadow" type="password"/>
                        </label>
                        <label className="w-full flex items-center justify-between mt-2">
                            New Password:
                            <input onChange={(e) => setNewPass(e.target.value)} value={newPass} className="text-sm w-1/2 ml-2 py-1 px-2 rounded shadow" type="password"/>
                        </label>
                        <label className="w-full flex items-center justify-between mt-2">
                            Confirm New:
                            <input onChange={(e) => setNewPassAgain(e.target.value)} value={newPassAgain} className="text-sm w-1/2 ml-2 py-1 px-2 rounded shadow" type="password"/>
                        </label>
                    </div>
                : 
                    null
                }

                <button type="button" onClick={() => setPasswordChange(!passwordChange)} className={passwordChange ? "animate-bounce w-10 my-4" : "text-blue-500 underline text-sm mt-2"}>{passwordChange ? <img src="up.svg" alt="arrow up" /> : "Click here to change your password."}</button>

                <button onClick={handleSave} className="my-2 text-lg bg-secondary text-gray-100 rounded shadow mx-2 px-4 py-2 hover:opacity-75">Save</button>
                
                <button onClick={handleDeleteForm} type="button" className="text-red-500 underline text-xs mt-2">Delete account.</button>

                <h5>{message}</h5>

            </form>
        </div>
    )
}
