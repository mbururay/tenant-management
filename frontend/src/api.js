export const authHeaders = () => ({

    "Content-Type": "application/json",

    Authorization:
        `Bearer ${localStorage.getItem("token")}`

});


export const apiFetch = async (url, options = {}) => {

    const response = await fetch(url, {

        ...options,

        headers: {
            ...authHeaders(),
            ...(options.headers || {})
        }

    });


    if (response.status === 401) {

        console.log("This has been hit");

        localStorage.removeItem("token");

        localStorage.setItem(
            "sessionExpired",
            "true"
        );

        window.location.href = "/login";

        return null;
    }


    return response;

};