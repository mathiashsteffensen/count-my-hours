window.onload = () =>
{
    document.querySelectorAll('form').forEach((form) => form.querySelectorAll('button').forEach((button) =>
    {
        button.addEventListener('click', (e) =>
        {
            let inputs = form.querySelectorAll('input')
            let validInputs = [...inputs].filter(input => input.validity.valid)
            validInputs.forEach((input) => console.log(input.validity.valid))
            if (validInputs.length === inputs.length)
            {
                button.innerHTML = '<img src="loader.svg" class="loading">'
            }
        })
    }))
}