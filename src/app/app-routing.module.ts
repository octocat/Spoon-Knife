import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ChatComponent} from './chat/chat.component';
import {OptionsComponent} from './options/options.component';
import {HomeComponent} from './home/home.component';

const routes: Routes = [
	{ path: '', component: HomeComponent},
	{ path: 'chat', component: ChatComponent},
	{ path: 'options', component: OptionsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { } 
export const routingComponents = [ChatComponent, OptionsComponent, HomeComponent]