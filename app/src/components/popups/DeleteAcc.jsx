import React, {useState} from 'react'

export default function DeleteAcc({removeForm}) 
{
    const [errorMessage, setErrorMessage] = useState(false)
    const [password, setPassword] = useState('')
    const [deleteText, setDeleteText] = useState('')

    let handleFormSubmit = () =>
    {
        if (deleteText !== "DELETE")
        {
            setErrorMessage("Please make sure to enter the delete text correctly")
        } else
        {
            fetch((process.env.NODE_ENV === 'production' ? '' : 'http://localhost:4000') + '/settings/account', {
                method: "delete",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    password: password
                })
            }).then((res) =>
            {
                switch(res.status)
                {
                    case 200:
                        setErrorMessage("Your account has been deleted, bye")
                        setTimeout(() =>
                        {
                            document.cookie = ""
                            window.location.pathname = "/"
                        }, 400)
                        break;
                    case 400:
                        setErrorMessage("Password incorrect")
                        break;
                    case 500:
                        setErrorMessage("An error occured")
                        break;
                    default:
                }
            })
        }
    }

    return (
        <form className=" md:w-1/2 flex flex-col justify-center items-center p-4 bg-primary opacity-100 w-10/12 rounded shadow relative" onClick={(e) => e.stopPropagation()} action="">
            <img onClick={removeForm} className="absolute w-10 top-0 right-0 cursor-pointer hover:opacity-75" src="x-in-circle.svg" alt="close form"/>
            <h3 className="font-semibold text-xl mt-4">Delete your user</h3>

            <label className="font-medium w-full flex flex-col items-center justify-between mt-2">
                Please confirm your password:
                <input onChange={(e) => setPassword(e.target.value)} value={password} className="text-sm w-8/22 ml-2 py-1 px-2 rounded shadow" type="password"/>
            </label>

            <label className="font-medium w-full flex flex-col items-center justify-between mt-2">
                Enter the exact text <i>"DELETE"</i> to continue:
                <input onChange={(e) => setDeleteText(e.target.value)} value={deleteText} className="text-sm w-8/22 ml-2 py-1 px-2 rounded shadow" type="text"/>
            </label>
            
            <p className="text-red-600 text-sm font-semibold pb-2 text-center">{errorMessage}</p>
            <button onClick={handleFormSubmit} className="bg-secondary text-gray-100 rounded shadow px-4 py-2 hover:opacity-75">Delete Account</button>
        </form>
    )
}
