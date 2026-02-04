import { Provider } from '@angular/core';
import { AbstractUserService } from './abstract-user.service';
import { MockUserService } from './mock-user.service';
import { UserService } from './user.service';
import { environment } from '../../../../environments/environments';

export const userServiceProvider: Provider = {
  provide: AbstractUserService,
  useClass: environment.useMockService ? MockUserService : UserService,
};
