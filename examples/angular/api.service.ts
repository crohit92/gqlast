import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import gqlAst from './gql-ast';
import { pluck } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class ApiService {
    constructor(private http: HttpClient) {
    }

    query(literals: TemplateStringsArray, ...placeholders: any[]): Observable<any> {
        const query = gqlAst(literals, placeholders);
        return this.http.request('post', environment.graphQlEndpoint, {
            body: {
                query: query
            }
        }).pipe(pluck('data', this.firstChildOfRootField(query)));
    }

    /**
     * @description
     * Determines the name of the field in which response is sent by the GraphQL server
     * 
     * For example if a query was made like: 
     * 
     * Query to Fetch all orders
     * ```
     * query { 
     *  orders { 
     *      _id 
     *      total
     *      customer { 
     *          name 
     *      } 
     *  } 
     * }
     * ```
     * 
     * The response of the above query will be something like
     * ```
     * {
     *  "data": {
     *      "orders": [
     *          {
     *              "_id":"1",
     *              "total": 25,
     *              "customer": {
     *                  "name": "Rohit"
     *              }   
     *          }
     *      ]
     *  }
     * }
     * ```
     * 
     * Here the `firstChildOfRootField` is `orders` and will be returned
     * from this function
     * @param {string} query query or mutation to be sent to the GraphQL server
     */
    private firstChildOfRootField(query: string) {
        let indexOfOpeningBracket = query.indexOf('{');
        const fieldNameCharArr = [];
        const newLine = `
        `;
        const space = ' ';
        for (let index = indexOfOpeningBracket + 1; index < query.length; index++) {
            const char = query[index];
            if ((char.charCodeAt(0) === newLine.charCodeAt(0) || char.charCodeAt(0) === space.charCodeAt(0)) && fieldNameCharArr.length === 0) {
                continue;
            } else if (/[a-zA-Z]/.test(char)) {
                fieldNameCharArr.push(char);
            } else {
                break;
            }
        }
        return fieldNameCharArr.join('');
    }

}
