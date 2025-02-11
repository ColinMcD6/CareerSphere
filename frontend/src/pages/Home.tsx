import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    const handleClick = async () => {
        navigate("/welcome");
    }


    return <Button onClick={handleClick}>Enter</Button>;
}

export default Home;