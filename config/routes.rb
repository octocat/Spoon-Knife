Rails.application.routes.draw do
  root 'wellcome#index'
  resources :products
end
