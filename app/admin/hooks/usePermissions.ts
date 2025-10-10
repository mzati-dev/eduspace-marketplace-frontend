import { useAppContext } from "@/context/AppContext";

export const usePermissions = () => {
    const { user } = useAppContext();

    const hasPermission = (permission: string) => {
        return user?.permissions?.includes(permission) || false;
    };

    return { hasPermission };
};