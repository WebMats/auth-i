import React from 'react';


export default React.createContext({
    email: null,
    userId: null,
    login: (email, userId) => {},
    logout: () => {}
})