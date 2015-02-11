Mepaseaste::Application.routes.draw do

  devise_for :users

  root to: 'home#index'

  resources :queries, only: [:show]
  resources :about, only: [:index] do
    collection do
      get :algoritmos_evolutivos
      get :premios
      get :articulos
      get :funcionamiento
    end
  end

  namespace :api do
    resources :queries
  end

  namespace :admin do
    resources :home, only: :index
  end

end
