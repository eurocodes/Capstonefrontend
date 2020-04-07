export const getToken = () => {
    return sessionStorage.getItem('token')
}

export const setUserSession = (token) => {
    sessionStorage.setItem('token', token);
}

export const removeUserSession = () => {
    sessionStorage.removeItem('token');
}
