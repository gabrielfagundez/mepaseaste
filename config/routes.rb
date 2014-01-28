Mepaseaste::Application.routes.draw do
  root to: 'home#index'

  devise_for :users
  mount RailsAdmin::Engine => '/admin', as: 'rails_admin'

  # Manejo de consultas
  post '/sending_data'  => 'data#process_data'
  post '/save_query'    => 'data#save_query'
  get '/show_data'      => 'data#show_data'

  # Sección internacional
  namespace :international do
    get '/'             => 'home#index'
  end

  # Sección marketplace
  namespace :marketplace do
    get '/'             => 'home#index'
  end

  # Páginas estáticas
  get '/contacto'       => 'contact#contacto'
  get '/about'          => 'contact#about'

  get '/profile'        => 'profile#show'



  # Para TFF
  get '/tff_get_location_entity' => 'tff#get_location_entity'

  namespace :api do
    get '/mobile/handle_request' => 'mobile#handle_request'
  end


end
