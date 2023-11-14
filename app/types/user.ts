export interface UserAuthenticate {
    userId?: number;
    avatarUrl?: string;
    email: string;
    employeeNo: string;
    refreshToken: string;
    refreshTokenExpiryTime: Date;
    role: string;
    token?: string;
}
