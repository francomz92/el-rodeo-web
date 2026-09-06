import { httpClient } from "../../../shared/utils/http/clients"

import AuthAPI from './auth.api.service'
import UserAPI from './user.api.service'


export const authAPI = new AuthAPI(httpClient)
export const userAPI = new UserAPI(httpClient)
