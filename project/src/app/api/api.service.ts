import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(public http: HttpClient) { }

  /** 向FHIR伺服器取資料 */
  getData(type: string, filter: string): Observable<any> {
    // return this.http.get<any>('http://hapi.fhir.org/baseR4/' + type + '?_format=json&_pretty=true&_count=40&' + filter);
    return this.http.get<any>('http://140.124.181.142:8888/hapi-fhir-jpaserver/fhir/' + type + '?_format=json&_pretty=true&_count=40&' + filter);
  }

  /** 向FHIR伺服器新增資料 */
  addData(type: string, data: any): Observable<any> {
    // const url = 'http://hapi.fhir.org/baseR4/' + type + '?_format=json&_pretty=true';
    const url = 'http://140.124.181.142:8888/hapi-fhir-jpaserver/fhir/' + type + '?_format=json&_pretty=true';
    return this.http.post(url, data);
  }

  /** 向FHIR伺服器更新資料 */
  updateData(type: string, data: any, id: string): Observable<any> {
    // const url = 'http://hapi.fhir.org/baseR4/' + type + '/' + id + '?_format=json&_pretty=true';
    const url = 'http://140.124.181.142:8888/hapi-fhir-jpaserver/fhir/' + type + '/' + id + '?_format=json&_pretty=true';
    return this.http.put(url, data);
  }

  /** 向FHIR伺服器刪除資料 */
  deleteData(type: string, id: string): Observable<any> {
    // const url = 'http://hapi.fhir.org/baseR4/' + type + '/' + id + '?_format=json&_pretty=true&_cascade=delete';
    const url = 'http://140.124.181.142:8888/hapi-fhir-jpaserver/fhir/' + type + '/' + id + '?_format=json&_pretty=true&_cascade=delete';
    return this.http.delete(url);
  }

/** 向寄信伺服器發出寄信需求 */
sendMail(data: any): Observable < any > {
  const url = 'http://localhost:3000/';
  return this.http.post(url, data);
}
}
