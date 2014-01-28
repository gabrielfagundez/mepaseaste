Mepaseaste::Application.routes.draw do
  root to: 'home#index'

  devise_for :users
  mount RailsAdmin::Engine => '/admin', as: 'rails_admin'

  # Manejo de consultas
  post '/sending_data'  => 'data#process_data'
  post '/save_query'    => 'data#save_query'
  get '/show_data'      => 'data#show_data'

  # Sección marketplace
  namespace :marketplace do
    get '/'             => 'home#index'
  end

  # Páginas estáticas
  get '/contacto'       => 'contact#contacto'
  get '/about'          => 'contact#about'

  get '/profile'        => 'profile#show'

  # Consultas
  resources :queries, only: [ :index, :destroy, :show ]

  # Ubicaciones preferidas
  resources :favourite_locations, only: [ :new, :create, :destroy, :show ]



  # Para TFF
  get '/tff_get_location_entity' => 'tff#get_location_entity'

  namespace :api do
    resources :queries
  end


end
