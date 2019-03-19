///<reference path="../../../../node_modules/rxjs/add/operator/map.d.ts"/>
import { Injectable, EventEmitter } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "rxjs/add/observable/throw";
import { environment } from "../../../environments/environment";
import * as filestack from 'filestack-js';

const apikey = 'Ak4ipCwLjQoKPBTo89Acvz';
const client = filestack.init(apikey);

@Injectable()
export class ImagesService {
  private url = "https://api.unsplash.com";
  private applicationId = environment.applicationId;
  searchEvent: EventEmitter<any> = new EventEmitter();
  page = 1;
  per_page = 20;
  cache = {};


  constructor(private http: Http) {
  }
  random(page: number): Observable<any[]> {
    return this.http
      .get(
        this.url +
          "/photos?client_id=" +
          this.applicationId +
          "&page=" +
          page +
          "&per_page=" +
          this.per_page
      )
      .map(response => response.json())
      .catch(this.handleError);
  }

  handleError(error: Response | any) {
    let errorMessage: string;
    if (error.status === 403 && error._body === "Rate Limit Exceeded") {
      errorMessage =
        "Oops! We have exceed our hourly free limit. Please try later.";
    } else {
      errorMessage = "Oops! Something went wrong. Please try again.";
    }
    return Observable.throw(errorMessage);
  }

  search(query: string, page: number) {
    if (query.length === 0) {
      this.searchEvent.emit("clear");
      return;
    }

    this.searchEvent.emit({ loading: true, page: page, query: query });
    let url = `${this.url}/search/photos?client_id=${this.applicationId}`;
    url += `&page=${page}&per_page=${this.per_page}&query=${query}`;

    this.http
      .get(url)
      .map(response => response.json())
      .subscribe(images => {
        this.searchEvent.emit(images);
      }, this.handleError);
  }

  getSearchEvent() {
    return this.searchEvent;
  }

  get(id: string): Observable<any[]> {

    return this.http
      .get(this.url + "/photos/" + id + "/?client_id=" + this.applicationId)
      .map(response => {
        const data = response.json();
       console.log(data.urls.small);

      })
      .catch(this.handleError);
  }
}
