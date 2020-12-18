import React from "react"
import ReactDOM from "react-dom"

import AddShift from './AddShift'
import DeleteAcc from "./DeleteAcc"
import UpdateShift from './UpdateShift'

function FormType({formType, date, removeForm, workHours}) {
    switch(formType)
    {
        case 'add-shift':
            return <AddShift removeForm={removeForm} date={date ? date : null} />
        case 'update-shift':
            return <UpdateShift workHours={workHours} removeForm={removeForm} />
        case 'delete-acc':
            return <DeleteAcc removeForm={removeForm} />
        default:
    }
}


function PopUp({removeForm, formType, date, workHours}) 
{
    return (
        <div onClick={removeForm} className="absolute inset-0 h-full w-full bg-opaque">
            <div className="sticky inset-1/4 flex justify-center items-center">
                <FormType workHours={workHours} removeForm={removeForm} date={date} formType={formType}/>
            </div>
        </div>
    )
}

export default function popUp(shouldPop, formType, removeForm, options)
{
    if (shouldPop) ReactDOM.render(<PopUp workHours={options.workHours ? options.workHours : null} date={options.date ? options.date : null} removeForm={removeForm} formType={formType} />, document.getElementById("popup"))
    else ReactDOM.render('', document.getElementById("popup"))
}