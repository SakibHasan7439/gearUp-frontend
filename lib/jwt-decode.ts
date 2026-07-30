import { JwtUserPayload } from "@/types";

export const decodeJwtToken = (token: string): JwtUserPayload | null => {
    try {
        const payload = token.split(".")[1];
        const decode = JSON.parse(atob(payload));
        return decode as JwtUserPayload;
    }catch (error) {
        console.error("Failed to decode JWT token:", error);
        return null;
    }
}

export const isTokenExpired = (token: string): boolean => {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if(!payload.exp) return false;
        return Date.now() >= payload.exp * 1000;
    } catch {
        return true;
    }
}