class FavouriteLocationsController < ApplicationController

  def new
    @favourite_location = FavouriteLocation.new
  end

  def create
    raise params.inspect

    @favourite_location = FavouriteLocation.new(params[:favourite_location])

    if @favourite_location.save
      redirect_to queries_path
    else
      render :new
    end
  end

end