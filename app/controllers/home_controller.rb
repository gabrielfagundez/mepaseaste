class HomeController < ApplicationController

  def landing
    render layout: false
  end

  def app
    delete_previous_run
    render :index
  end

  def index
    delete_previous_run
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
