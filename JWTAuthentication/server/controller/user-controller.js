import { generateAccessToken, generateRefreshToken } from "../utils/jwtAuthentication.js"


const users = [{
    id: '1',
    email: 'codefor',
    password: '1234'
}]


let tokens = []

export const userLogin = (request, response) => {
    const { email, password } = request.body;

    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user);

        tokens.push(refreshToken);

        response.json({
            email: user.email,
            accessToken,
            refreshToken
        })

        console.log("User login")
    } else {
        response.status(404).json("Incorrect user or password");
    }
}


export const getUser = (request, response) => {
    if (request.user.id == request.params.id) {
        console.log("user", request.user)
    } else {
        console.log("User is not accessable")
    }
}

export const logoutUser = (requset, response) => {
    const refreshToken = request.body.token;
    tokens = tokens.filter(token => token !== refreshToken);
    response.status(200).json('Logged out successfully');
}