import { useQuery } from "@tanstack/react-query"
import { getUser } from "../lib/api.lib"


export const USER = "user"


//Get user data from the server
const useUser = (opts = {}) => {
    const {
        data: user,
        ...rest
    } = useQuery({
        queryKey:[USER],
        queryFn: getUser,
        staleTime: Infinity,
        ...opts
    });
    return {
        user, ...rest
    }
};

export default useUser;