import { Component, OnInit, ModuleWithProviders } from "@angular/core";
import { Router } from "@angular/router";

import { ImagesService } from "../shared";
import { environment } from "../../environments/environment";
import * as filestack from "filestack-js";




const apikey = "Ak4ipCwLjQoKPBTo89Acvz";
const client = filestack.init(apikey);

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  images = [];
  loading = true;
  errorMessage = "";
  searchEvent: any;
  searchQuery = "";
  page = 0;
  total = 0;
  total_pages = 0;
  searchActive = false;
  imageBox = [];
  userImage = [];

  constructor(private imageService: ImagesService, private router: Router,
    ) {}

  ngOnInit() {
    this.random();
    this.search();

  }

  random() {
    this.loading = true;
    this.page += 1;
    this.errorMessage = "";
    this.imageService.random(this.page).subscribe(
      images => {

        this.imageBox.push(images);
        this.loading = false;
        this.errorMessage = "";
      },
      error => {
        this.loading = false;
        this.errorMessage = error;
      }
    );
  }

  search() {
    this.errorMessage = "";
    this.searchEvent = this.imageService.getSearchEvent().subscribe(
      value => {
        this.searchActive = true;
        if (value.hasOwnProperty("loading") && value.page === 0) {
          this.imageBox = [];
          this.page = 0;
          this.searchQuery = value.query;
          this.loading = true;
        } else if (value.hasOwnProperty("loading")) {
          this.loading = true;
        } else if (value.hasOwnProperty("errorMessage")) {
          this.errorMessage = value.errorMessage;
          this.loading = false;
        } else if (value.hasOwnProperty("results")) {
          this.loading = false;
          this.total = value.total;
          this.total_pages = value.total_pages;
          this.imageBox.push(value.results);
          this.page += 1;
        } else {
          this.searchActive = false;
          this.errorMessage = "";
          this.page = 0;
          this.searchQuery = "";
          this.imageBox = [];
          this.random();
        }
      },
      error => {
        this.loading = false;
        this.errorMessage = error;
      }
    );
  }


  uploadImage(image) {
    const fileData = image.urls.small;
    client
      .storeURL(fileData)
      .then(res => {
        console.log("success: ", res, 'uploaded to the filestack');

      })
      .catch(err => {
        console.log(err);
      });

  }
}
