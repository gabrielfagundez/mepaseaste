class HomeController < ApplicationController
  def index
    unless current_user
      redirect_to 'public/index.html'
    end
  end
end
