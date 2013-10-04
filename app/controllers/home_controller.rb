class HomeController < ApplicationController
  def index
    unless current_user
      redirect_to '/presentacion.html'
    end
  end
end
