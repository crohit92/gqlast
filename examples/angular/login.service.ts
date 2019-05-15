import { Injectable } from "@angular/core";
import { Credentials } from "../shared/models/credentials";
import { ApiService } from "./api.service";

@Injectable()
export class LoginService {
    /**
     *
     */
    constructor(
        private readonly api: ApiService) {

    }
    login(credentials: Credentials) {
        return this.api.query`mutation {
                login(credentials: {
                    userId: ${credentials.userId}
                    password: ${credentials.password}
                }) {
                    name
                    admin
                    token
                }
            }
            `
    }
}