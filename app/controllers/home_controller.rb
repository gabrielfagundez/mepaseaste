class HomeController < ApplicationController

  def landing
    render layout: false
  end

  def app
    delete_previous_run
    @favourite_locations = current_user.try(:favourite_locations) || []
    render :index
  end

  def index
    if current_user.present?
      delete_previous_run
      @favourite_locations = current_user.try(:favourite_locations) || []
    else
      redirect_to landing_path
    end
  end

  private

  def delete_previous_run
    # Borramos ejecucion previa del algoritmo si existe
    #begin
    #  FileUtils.rm('public/raw_results.txt')
    #rescue
    #end
    begin
      FileUtils.rm('public/parametros.txt')
    rescue
    end
    begin
      FileUtils.rm('public/sol.txt')
    rescue
    end
    begin
      FileUtils.rm('public/costos.txt')
    rescue
    end
  end


end
