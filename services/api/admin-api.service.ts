// src/services/api/admin-api.service.ts
import { UserProfile } from '@/types';
import { API_ENDPOINTS } from './api.constants';
import { BaseApiService } from './base-api.service';

// DTO type to match the backend
// type CreateUserDto = Omit<UserProfile, 'id' | 'createdAt' | 'isVerified'>;
type CreateUserDto = Omit<UserProfile, 'id' | 'createdAt' | 'isVerified'> & {
    permissions?: string[]; // ✅ Correct placement inside the type
};

export class AdminApiService extends BaseApiService {
    async getAllUsers(): Promise<UserProfile[]> {
        return this.get<UserProfile[]>(API_ENDPOINTS.ADMIN.USERS);
    }

    async createUser(userData: CreateUserDto): Promise<UserProfile> {
        return this.post<UserProfile>(API_ENDPOINTS.ADMIN.USERS, userData);
    }
}