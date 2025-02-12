import { useQuery } from "@tanstack/react-query"
import { getUser } from "../lib/api"


export const USER = "user"

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