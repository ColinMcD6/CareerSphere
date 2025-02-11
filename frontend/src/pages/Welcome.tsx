import useUser from "../hooks/user";

const Welcome = () => {
    const {user} = useUser();
    return <h1>Welcome {user?.firstName} {user?.lastName}!</h1>
}

export default Welcome;