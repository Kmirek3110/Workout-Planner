import {useCookies} from 'react-cookie';
import {useEffect} from 'react'

/* 
    Komponent którego głównym zadaniem jest obsługa wylogowywania.
    Tracimy token autoryzacyjny oraz przechodzimy do strony głównej.
*/
function LogOut() {

    const [, , removeCookie] = useCookies(['mytoken']);
    
    useEffect(() => {
        removeCookie('mytoken')
        window.location.href = '/';
        
    }, [removeCookie])
    return (null)
}

export default LogOut
