import {useCookies} from 'react-cookie';
import {useEffect} from 'react'
function LogOut() {

    const [, , removeCookie] = useCookies(['mytoken']);

    useEffect(() => {
        removeCookie('mytoken')
        window.location.href = '/';
        
    }, [removeCookie])
    return (null)
}

export default LogOut
