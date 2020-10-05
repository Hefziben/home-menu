import { Injectable } from '@angular/core';
import { API } from "../environments/environment";
import axios from 'axios'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }
  
  
  getLocation(){
    return axios.get(`${API}location`);
  }
  sqlLocationPost(data){
    return axios.post(`${API}/location`,data)
  }
  sqlLocationGet(){
    return axios.get(`${API}/location`)
  }
  sqlNearCondos(id){
    return axios.get(`${API}/demand/${id}`)
  }
  sqlLocationDelete(id){
    return axios.delete(`${API}/location/${id}`)
  }

  sqlNearLoc(data){
    return axios.post(`${API}/location/filter`, data)
  }
  getEngaged(){
    return axios.get(`${API}/engaged`);
  }
  getAddbyId(id){
    return axios.get(`${API}/address/${id}`);
  }

  getBusinfo(){
    return fetch(`../assets/sgStationsData/bus.json`);
  }

  apiGetRequest(path) {
    return axios.get(`${API}/api/${path}`);
}
  apiPostRequest(data) {
        return axios.post(`${API}/api`, data);
  }
  
}
