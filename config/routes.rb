Mepaseaste::Application.routes.draw do

  root to: 'home#index'

  resources :queries, only: [:show]
  resources :about, only: [:index] do
    collection do
      get :algoritmos_evolutivos
      get :premios
      get :articulos
    end
  end

  namespace :api do
    resources :queries
  end

end
