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
  

end