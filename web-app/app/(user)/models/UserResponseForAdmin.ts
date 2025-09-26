export interface UserResponseForAdmin {
  id: number;
  userName: string;
  email: string;
  roles: Role[];
}

export interface Role {
  id: number;
  roleName: string;
}
