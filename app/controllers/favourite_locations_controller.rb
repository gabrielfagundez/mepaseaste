class FavouriteLocationsController < ApplicationController

  def new
    @favourite_location = FavouriteLocation.new
  end

end