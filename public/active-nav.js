window.onload = () =>
{
    document.querySelector('.header-nav').querySelectorAll('a').forEach((e) =>
    {
        console.log(e.innerText)
        if (window.location.href === e.href && window.location.href !== 'http://localhost:4000/signup')
        {
            setTimeout(() =>
            {
                e.parentElement.classList.add('active-nav')
            }, 300)
        }
    })

}