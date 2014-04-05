class FavouriteLocationsController < ApplicationController

  def index
    @favourite_locations = current_user.favourite_locations
  end

  def new
    @favourite_location = FavouriteLocation.new
  end

  def show
    @favourite_location = FavouriteLocation.find(params[:id])
  end

  def create
    @favourite_location = FavouriteLocation.new(favourite_location_params)

    if @favourite_location.save
      redirect_to queries_path
    else
      render :new
    end
  end

  def edit
    @favourite_location = FavouriteLocation.find(params[:id])
  end

  def update
    @favourite_location = FavouriteLocation.find(params[:id])

    if @favourite_location.update_attributes(params[:favourite_location])
      redirect_to queries_path
    else
      render action: :edit
    end
  end

  def destroy
    @favourite_location = FavouriteLocation.find(params[:id])
    @favourite_location.destroy

    redirect_to queries_path
  end

  private

  def favourite_location_params
    params.require(:favourite_location).permit(:name, :latitude, :longitude, :user_id, :address)
  end
  

end