import { AuthService } from './auth.service';
import { RouteHandlerProps } from '@/core/router';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async ({ res }: RouteHandlerProps) => {
    const data = await this.authService.login();
    res.json(data);
  };
}

const authController = new AuthController();
export default authController;
