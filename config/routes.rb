Mepaseaste::Application.routes.draw do

  root to: 'home#app'

  get 'landing' => 'home#landing'
  get 'app'     => 'home#app'

  devise_for :users

  # Manejo de consultas
  post '/sending_data'  => 'data#process_data'
  post '/save_query'    => 'data#save_query'
  get '/show_data'      => 'data#show_data'

  # Acerca De
  resources :about, only: [:index] do
    collection do
      get 'ga'
    end
  end

end
