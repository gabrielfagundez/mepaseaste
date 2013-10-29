class ProfileController < ApplicationController

  CANTIDAD_UBICACIONES = 7

  def show
    @locations = current_user.locations.order_by_quantity.limit(CANTIDAD_UBICACIONES)
  end

end
