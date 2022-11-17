import { Component } from '@angular/core';

import { Product } from './models/product.model';

import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';
import { FilesService } from './services/files.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  imgParent = 'https://www.w3schools.com/howto/img_avatar.png';

  showImage = true;
  token = '';
  imgRta = '';

  constructor(
    private authService: AuthService,
    private usersService : UsersService,
    private fileService : FilesService
  ){}

  onLoaded(event: string){
    console.log('log padre ', event);
  }

  toggleImage() {
    this.showImage = !this.showImage;
  }

  createUser(){
    this.usersService.create({
      name: 'Sebas',
      email: 'sebas@mail.com',
      password: '1212'
    })
    .subscribe(rta => {
      console.log(rta);
    });
  }

  login(){
    this.authService.login('sebas@mail.com', '1212')
    .subscribe(rta => {
      console.log(rta);
      this.token = rta.access_token;
    });
  }

  getProfile(){
    this.authService.profile(this.token)
    .subscribe(profile => {
      console.log(profile)
    });
  }

  donwloadPdf(){
    this.fileService.getFile('my.pdf', 'https://young-sands-07814.herokuapp.com/api/files/dummy.pdf', 'application/pdf')
    .subscribe();
  }

  onUpload(event: Event){
    const element = event.target as HTMLInputElement;
    const file = element.files?.item(0);
    if(file){
      this.fileService.uploadFile(file)
      .subscribe( rta => {
        this.imgRta = rta.location;
      })
    }
  }
}
