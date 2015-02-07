Mepaseaste::Application.routes.draw do

  root to: 'home#app'

  get 'landing' => 'home#landing'
  get 'app'     => 'home#app'

  devise_for :users

  resources :queries, only: [:show]

  resources :about, only: [:index] do
    collection do
      get 'ga'
    end
  end

  namespace :api do
    resources :queries
  end

end
