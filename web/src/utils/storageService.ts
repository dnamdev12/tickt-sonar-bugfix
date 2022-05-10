function getItem(key: string) {
    try {
        let value: string | null = localStorage.getItem(key);
        if(value) {
            return JSON.parse(value);
        }
        return null;
    }
    catch (err) {
        console.log(err)
    }
}

function setItem(key: string, value: any) {
    let val: string = JSON.stringify(value);
    try {
        return localStorage.setItem(key, val);
    }
    catch (err) {
        console.log(err)
    }
}

function removeItem(key: string) {
    try {
        return localStorage.removeItem(key);
    }
    catch (err) {
        console.log(err)
    }
}

function clearAll() {
    try {
        // to prevent this value from getting cleared on logout
        const firstLogin = localStorage.getItem('firstLogin');
        localStorage.clear();

        if (firstLogin) {
          localStorage.setItem('firstLogin', firstLogin);
        }
    }
    catch (err) {
        console.log(err)
    }
}

export default {
    getItem,
    setItem,
    removeItem,
    clearAll
}