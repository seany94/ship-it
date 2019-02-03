Rails.application.routes.draw do
  resources :jobs
  devise_for :users, :controllers => { registrations: 'registrations' }
  root 'users#index'
  get '/map' => 'jobs#map', as: 'job_map'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end