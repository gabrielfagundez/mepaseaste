class TffController < ApplicationController

  API_KEY = 'd6apr3UDROuv'
  ENTITY_URL = 'http://api.taxifarefinder.com/entity?key=' + API_KEY + '&'
  COST_URL = 'http://api.taxifarefinder.com/fare?key=' + API_KEY + '&'

  def get_location_entity
    latitude = params[:latitude]
    longitude = params[:longitude]

    url = ENTITY_URL + 'location=' + latitude + ',' + longitude
    http_response = HTTParty.get(url)

    render json: http_response.body
  end

  def get_cost

    url = COST_URL
    http_response = HTTParty.get(url)

    render json: http_response.body
  end
end
