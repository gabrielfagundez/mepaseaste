Mepaseaste::Application.routes.draw do
  root to: 'home#index'

  devise_for :users

  mount RailsAdmin::Engine => '/admin', as: 'rails_admin'

  # Manejo de consultas
  post '/sending_data'  => 'data#process_data'
  post '/save_query'    => 'data#save_query'
  get '/show_data'      => 'data#show_data'

  # Manejo del perfil
  get '/profile'        => 'profile#show'

  # Consultas
  resources :queries, only: [ :index, :destroy, :show ]

  # Ubicaciones preferidas
  resources :favourite_locations

  # Acerca De
  resources :about, only: :index do
    collection do
      get 'ga'
    end
  end

  # API para desarrollo mobile
  namespace :api do
    resources :queries
  end

  # Sección marketplace
  namespace :marketplace do
    get '/'             => 'home#index'
  end


end
