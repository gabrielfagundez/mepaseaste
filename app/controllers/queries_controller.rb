class QueriesController < ApplicationController

  def index
    @queries = current_user.queries.limit(10)
    @favourite_locations = current_user.favourite_locations
  end

end