import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {NotificationsComponent} from './components/notifications/notifications.component';
import {
  FilterByCategoryPipe,
  FilterByNamePipe,
  FilterByPricePipe,
  filterEmailPipe,
  filterGenderPipe,
  filterPasswordPipe
} from './pipes/search.pipe';
import {HomeComponent} from './components/home/home.component';
import {TitlePipe} from './pipes/title/title.pipe';
import {CategoriesComponent} from './components/categories/categories.component';
import {CartComponent} from './components/cart/cart.component';
import {LoginComponent} from './components/login/login.component';
import {BasketComponent} from './components/basket/basket.component';
import {ConfirmationModalComponent} from './components/confirmation-dialog/confirmation-dialog.component';
import {AdminComponent} from './components/admin/admin.component';
import {OrderComponent} from './components/order/order.component';
import {MyOrdersComponent} from './components/my-orders/my-orders.component';
import {SignupComponent} from './components/signup/signup.component';
import {ProductsComponent} from './components/products/products.component';
import {AboutComponent} from './components/about/about.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap';
import {GlobalService} from './services/global.service';
import {AuthService} from './services/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    NotificationsComponent,
     HomeComponent,
    TitlePipe,
    ConfirmationModalComponent,
    LoginComponent,
    SignupComponent,
    ProductsComponent,
    CategoriesComponent,
    CartComponent,
    AdminComponent,
    BasketComponent,
    OrderComponent,
    MyOrdersComponent,
    AboutComponent,
    FilterByNamePipe,
    FilterByPricePipe,
    FilterByCategoryPipe,
    filterEmailPipe,
    filterPasswordPipe,
    filterGenderPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ModalModule.forRoot(),
  ],
  providers: [
    GlobalService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
